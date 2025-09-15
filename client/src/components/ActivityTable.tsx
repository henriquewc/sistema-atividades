import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { StatusBadge, ActivityStatus } from "./StatusBadge";
import { Search, Filter, Eye, Edit, Paperclip, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Activity, Client } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface ActivityTableProps {
  activities?: Activity[];
}

export function ActivityTable({ activities: propActivities = [] }: ActivityTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [serviceFilter, setServiceFilter] = useState("todos");
  const { toast } = useToast();

  const { data: apiActivities = [], isLoading: activitiesLoading } = useQuery<Activity[]>({
    queryKey: ['/api/activities'],
    enabled: propActivities.length === 0, // Only fetch if no activities provided via props
  });

  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ['/api/clients'],
  });

  const completeActivityMutation = useMutation({
    mutationFn: (activityId: string) => 
      apiRequest(`/api/activities/${activityId}/complete`, { method: 'POST' }),
    onSuccess: (data: Activity) => {
      toast({
        title: "Atividade marcada como realizada",
        description: `"${data.nome}" foi concluída com sucesso.`,
        duration: 3000,
      });
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
      queryClient.invalidateQueries({ queryKey: ['/api/clients'] });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível marcar a atividade como realizada.",
        variant: "destructive",
        duration: 3000,
      });
    },
  });

  const markAsCompleted = (activityId: string) => {
    completeActivityMutation.mutate(activityId);
  };

  // Use propActivities if provided, otherwise use API data
  const displayActivities = propActivities.length > 0 ? propActivities : apiActivities;

  // Create a map of clients for quick lookup
  const clientMap = new Map(clients.map((client: Client) => [client.id, client.nomeCompleto]));

  // Add client names to activities
  const activitiesWithClients = displayActivities.map((activity: Activity) => ({
    ...activity,
    cliente: clientMap.get(activity.clienteId) || "Cliente não encontrado",
  }));

  const filteredActivities = activitiesWithClients.filter((activity: Activity & {cliente: string}) => {
    const matchesSearch = activity.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.cliente.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "todos" || activity.status === statusFilter;
    const matchesService = serviceFilter === "todos" || activity.tipoServico === serviceFilter;
    return matchesSearch && matchesStatus && matchesService;
  });

  if (activitiesLoading && propActivities.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Carregando atividades...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar atividades ou clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-testid="input-search-activities"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48" data-testid="select-status-filter">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os status</SelectItem>
            <SelectItem value="em_dia">Em dia</SelectItem>
            <SelectItem value="vencimento_proximo">Vencimento próximo</SelectItem>
            <SelectItem value="atrasada">Atrasada</SelectItem>
            <SelectItem value="concluida">Concluída</SelectItem>
          </SelectContent>
        </Select>
        <Select value={serviceFilter} onValueChange={setServiceFilter}>
          <SelectTrigger className="w-full sm:w-48" data-testid="select-service-filter">
            <SelectValue placeholder="Tipo de Serviço" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os serviços</SelectItem>
            <SelectItem value="Geração">Geração</SelectItem>
            <SelectItem value="Monitoramento">Monitoramento</SelectItem>
            <SelectItem value="Envio de Dados">Envio de Dados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabela */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Atividade</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Tipo de Serviço</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredActivities.map((activity: Activity & {cliente: string}) => (
              <TableRow key={activity.id} data-testid={`row-activity-${activity.id}`}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {activity.nome}
                    <Paperclip className="h-3 w-3 text-muted-foreground" />
                  </div>
                </TableCell>
                <TableCell>{activity.cliente}</TableCell>
                <TableCell>
                  <Badge variant="outline">{activity.tipoServico}</Badge>
                </TableCell>
                <TableCell>{new Date(activity.dataVencimento).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell>
                  <StatusBadge status={activity.status as ActivityStatus} />
                </TableCell>
                <TableCell>{activity.responsavel || "-"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {activity.status !== "concluida" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsCompleted(activity.id)}
                        data-testid={`button-complete-${activity.id}`}
                        title="Marcar como realizada"
                        className="text-chart-1 hover:text-chart-1"
                        disabled={completeActivityMutation.isPending}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => console.log('Ver atividade:', activity.id)}
                      data-testid={`button-view-${activity.id}`}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => console.log('Editar atividade:', activity.id)}
                      data-testid={`button-edit-${activity.id}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredActivities.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Nenhuma atividade encontrada com os filtros aplicados.
        </div>
      )}
    </div>
  );
}