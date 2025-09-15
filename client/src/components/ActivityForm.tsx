import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Save, Activity, Upload } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { Client } from "@shared/schema";

const activityFormSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  tipoServico: z.enum(["Geração", "Monitoramento", "Envio de Dados"]),
  clienteId: z.string().min(1, "Cliente é obrigatório"),
  dataVencimento: z.date({ required_error: "Data de vencimento é obrigatória" }),
  observacoes: z.string().optional(),
  responsavel: z.string().optional(),
  tipoRecorrencia: z.enum(["Mensal", "Anual"]),
  intervaloRecorrencia: z.number().min(1, "Intervalo deve ser pelo menos 1").max(12, "Intervalo máximo é 12"),
});

type ActivityFormData = z.infer<typeof activityFormSchema>;

interface ActivityFormProps {
  initialData?: Partial<ActivityFormData>;
  onSubmit?: (data: ActivityFormData) => void;
  isEditing?: boolean;
}

export function ActivityForm({ initialData, onSubmit, isEditing = false }: ActivityFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const form = useForm<ActivityFormData>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: {
      nome: "",
      tipoServico: "Geração",
      clienteId: "",
      dataVencimento: undefined,
      observacoes: "",
      responsavel: "",
      tipoRecorrencia: "Mensal",
      intervaloRecorrencia: 1,
      ...initialData,
    },
  });

  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ['/api/clients'],
  });

  const handleSubmit = async (data: ActivityFormData) => {
    setIsSubmitting(true);
    console.log(isEditing ? 'Editando atividade:' : 'Criando atividade:', data);
    console.log('Arquivos anexados:', selectedFiles);
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (onSubmit) {
      onSubmit(data);
    }
    
    if (!isEditing) {
      form.reset();
      setSelectedFiles([]);
    }
    
    setIsSubmitting(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    // Filtrar apenas PDF e JPEG, max 5MB
    const validFiles = files.filter(file => {
      const isValidType = file.type === 'application/pdf' || file.type === 'image/jpeg';
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      return isValidType && isValidSize;
    });
    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          {isEditing ? "Editar Atividade" : "Nova Atividade"}
        </CardTitle>
        <CardDescription>
          {isEditing ? "Atualize as informações da atividade" : "Cadastre uma nova atividade no sistema"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Atividade</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Descrição da atividade" 
                      {...field} 
                      data-testid="input-nome-atividade"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tipoServico"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Serviço</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-tipo-servico">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Geração">Geração</SelectItem>
                        <SelectItem value="Monitoramento">Monitoramento</SelectItem>
                        <SelectItem value="Envio de Dados">Envio de Dados</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clienteId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-cliente">
                          <SelectValue placeholder="Selecione o cliente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.nomeCompleto}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dataVencimento"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data de Vencimento</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="w-full pl-3 text-left font-normal"
                            data-testid="button-data-vencimento"
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy", { locale: ptBR })
                            ) : (
                              <span>Selecione a data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="responsavel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsável (Opcional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Nome do responsável" 
                        {...field} 
                        data-testid="input-responsavel"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Recorrência */}
            <div className="space-y-4 border-t pt-6">
              <h3 className="font-medium text-lg">Configuração de Recorrência</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="tipoRecorrencia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Recorrência</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-tipo-recorrencia">
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Mensal">Mensal</SelectItem>
                          <SelectItem value="Anual">Anual</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="intervaloRecorrencia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Intervalo ({form.watch("tipoRecorrencia") === "Mensal" ? "meses" : "anos"})
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          min="1"
                          max="12"
                          placeholder="1"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                          data-testid="input-intervalo-recorrencia"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="observacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações Internas</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Observações sobre a atividade (visível apenas para a equipe)" 
                      {...field} 
                      data-testid="input-observacoes"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Upload de Anexos */}
            <div className="space-y-4 border-t pt-6">
              <h3 className="font-medium text-lg flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Anexos (PDF e JPEG - máx 5MB)
              </h3>
              
              <div className="space-y-2">
                <Input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg"
                  onChange={handleFileChange}
                  data-testid="input-files"
                />
                
                {selectedFiles.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {selectedFiles.length} arquivo(s) selecionado(s)
                    </p>
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          data-testid={`button-remove-file-${index}`}
                        >
                          Remover
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                data-testid="button-save-activity"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? "Salvando..." : (isEditing ? "Atualizar" : "Salvar Atividade")}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}