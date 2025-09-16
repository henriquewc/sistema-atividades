import { useState } from "react";
import { ClientForm } from "@/components/ClientForm";
import { ClientActivityHistory } from "@/components/ClientActivityHistory";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Eye, History } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Client } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function ClientsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<{id: string, name: string} | null>(null);
  const { toast } = useToast();

  const { data: clients = [], isLoading } = useQuery<Client[]>({
    queryKey: ['/api/clients'],
  });

  const createClientMutation = useMutation({
    mutationFn: (clientData: any) => apiRequest('/api/clients', { method: 'POST', data: clientData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/clients'] });
      toast({
        title: "Cliente criado com sucesso",
        description: "O novo cliente foi adicionado ao sistema.",
      });
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar cliente",
        description: "Ocorreu um erro ao tentar criar o cliente. Tente novamente.",
        variant: "destructive",
      });
      console.error('Erro ao criar cliente:', error);
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Carregando clientes...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-clients-title">
            Clientes
          </h1>
          <p className="text-muted-foreground">
            Gerencie todos os clientes cadastrados
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-new-client">
              <Plus className="w-4 h-4 mr-2" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Novo Cliente</DialogTitle>
            </DialogHeader>
            <ClientForm 
              onSubmit={(data) => {
                createClientMutation.mutate(data);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>
            {clients.filter(c => c.ativo).length} clientes ativos de {clients.length} total
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CPF/CNPJ</TableHead>
                <TableHead>Celular</TableHead>
                <TableHead>Contrato</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id} data-testid={`row-client-${client.id}`}>
                  <TableCell className="font-medium">{client.nomeCompleto}</TableCell>
                  <TableCell>{client.documento}</TableCell>
                  <TableCell>{client.celular}</TableCell>
                  <TableCell>{client.numeroContrato}</TableCell>
                  <TableCell>
                    <Badge variant={client.ativo ? "default" : "secondary"}>
                      {client.ativo ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedClient({id: client.id, name: client.nomeCompleto});
                          setHistoryDialogOpen(true);
                        }}
                        data-testid={`button-history-client-${client.id}`}
                        title="Ver histórico de atividades"
                      >
                        <History className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => console.log('Ver cliente:', client.id)}
                        data-testid={`button-view-client-${client.id}`}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => console.log('Editar cliente:', client.id)}
                        data-testid={`button-edit-client-${client.id}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog para Histórico de Atividades */}
      <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Histórico de Atividades</DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <ClientActivityHistory 
              clientId={selectedClient.id}
              clientName={selectedClient.name}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}