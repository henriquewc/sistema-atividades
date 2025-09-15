import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "./StatusBadge";
import { Paperclip } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Activity } from "@shared/schema";

interface ClientActivityHistoryProps {
  clientId: string;
  clientName: string;
}

export function ClientActivityHistory({ clientId, clientName }: ClientActivityHistoryProps) {
  const { data: clientActivities = [], isLoading } = useQuery<Activity[]>({
    queryKey: ['/api/clients', clientId, 'activities'],
    enabled: !!clientId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Carregando histórico de atividades...</div>
      </div>
    );
  }

  const activeActivities = clientActivities.filter(a => a.status !== "concluida");
  const completedActivities = clientActivities.filter(a => a.status === "concluida");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold" data-testid="text-client-history-title">
          Histórico de Atividades - {clientName}
        </h2>
        <p className="text-muted-foreground">
          Visualize todas as atividades relacionadas a este cliente
        </p>
      </div>

      {/* Atividades Ativas */}
      <Card>
        <CardHeader>
          <CardTitle>Atividades Ativas</CardTitle>
          <CardDescription>
            {activeActivities.length} atividades em andamento
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeActivities.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Atividade</TableHead>
                  <TableHead>Tipo de Serviço</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Responsável</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeActivities.map((activity: Activity) => (
                  <TableRow key={activity.id} data-testid={`row-active-activity-${activity.id}`}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {activity.nome}
                        <Paperclip className="h-3 w-3 text-muted-foreground" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{activity.tipoServico}</Badge>
                    </TableCell>
                    <TableCell>{new Date(activity.dataVencimento).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      <StatusBadge status={activity.status as any} />
                    </TableCell>
                    <TableCell>{activity.responsavel || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-4 text-muted-foreground">
              Nenhuma atividade ativa encontrada para este cliente.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Histórico de Atividades Concluídas */}
      <Card>
        <CardHeader>
          <CardTitle>Atividades Concluídas</CardTitle>
          <CardDescription>
            {completedActivities.length} atividades finalizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {completedActivities.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Atividade</TableHead>
                  <TableHead>Tipo de Serviço</TableHead>
                  <TableHead>Data Vencimento</TableHead>
                  <TableHead>Data Conclusão</TableHead>
                  <TableHead>Responsável</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {completedActivities.map((activity: Activity) => (
                  <TableRow key={activity.id} data-testid={`row-completed-activity-${activity.id}`}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {activity.nome}
                        <Paperclip className="h-3 w-3 text-muted-foreground" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{activity.tipoServico}</Badge>
                    </TableCell>
                    <TableCell>{new Date(activity.dataVencimento).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell className="text-chart-1 font-medium">
                      {activity.dataConclusao ? new Date(activity.dataConclusao).toLocaleDateString('pt-BR') : "-"}
                    </TableCell>
                    <TableCell>{activity.responsavel || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-4 text-muted-foreground">
              Nenhuma atividade concluída encontrada para este cliente.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}