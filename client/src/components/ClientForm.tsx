import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Save, UserPlus } from "lucide-react";
import { z } from "zod";
const clientFormSchema = z.object({
  nomeCompleto: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  documento: z.string()
    .min(1, "Documento é obrigatório")
    .max(50, "Documento muito longo"),
  endereco: z.string().min(5, "Endereço é obrigatório"),
  celular: z.string().min(10, "Celular deve ter pelo menos 10 dígitos"),
  numeroContrato: z.string().min(1, "Número do contrato é obrigatório"),
  loginConcessionaria: z.string().min(1, "Login da concessionária é obrigatório"),
  senhaConcessionaria: z.string().min(1, "Senha da concessionária é obrigatória"),
  ativo: z.boolean().default(true),
});

type ClientFormData = z.infer<typeof clientFormSchema>;

interface ClientFormProps {
  initialData?: Partial<ClientFormData>;
  onSubmit?: (data: ClientFormData) => void;
  isEditing?: boolean;
}

export function ClientForm({ initialData, onSubmit, isEditing = false }: ClientFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      nomeCompleto: "",
      documento: "",
      endereco: "",
      celular: "",
      numeroContrato: "",
      loginConcessionaria: "",
      senhaConcessionaria: "",
      ativo: true,
      ...initialData,
    },
  });

  const handleSubmit = async (data: ClientFormData) => {
    setIsSubmitting(true);
    console.log(isEditing ? 'Editando cliente:' : 'Criando cliente:', data);
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (onSubmit) {
      onSubmit(data);
    }
    
    if (!isEditing) {
      form.reset();
    }
    
    setIsSubmitting(false);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          {isEditing ? "Editar Cliente" : "Novo Cliente"}
        </CardTitle>
        <CardDescription>
          {isEditing ? "Atualize as informações do cliente" : "Cadastre um novo cliente no sistema"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nomeCompleto"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Nome completo do cliente" 
                        {...field} 
                        data-testid="input-nome-completo"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="documento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF ou CNPJ</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="000.000.000-00 ou 00.000.000/0000-00" 
                        {...field} 
                        data-testid="input-documento"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="celular"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Celular</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="(00) 00000-0000" 
                        {...field} 
                        data-testid="input-celular"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endereco"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Endereço</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Endereço completo do cliente" 
                        {...field} 
                        data-testid="input-endereco"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="numeroContrato"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número do Contrato</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Número do contrato" 
                        {...field} 
                        data-testid="input-numero-contrato"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ativo"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Cliente Ativo</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Determina se o cliente está ativo no sistema
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="switch-ativo"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Credenciais da Concessionária */}
            <div className="space-y-4 border-t pt-6">
              <h3 className="font-medium text-lg">Credenciais da Concessionária</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="loginConcessionaria"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Login</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Login de acesso" 
                          {...field} 
                          data-testid="input-login-concessionaria"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="senhaConcessionaria"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input 
                          type="password"
                          placeholder="Senha de acesso" 
                          {...field} 
                          data-testid="input-senha-concessionaria"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                data-testid="button-save-client"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? "Salvando..." : (isEditing ? "Atualizar" : "Salvar Cliente")}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}