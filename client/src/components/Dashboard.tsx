import { DashboardCard } from "./DashboardCard";
import { ActivityTable } from "./ActivityTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity as ActivityIcon, Users, Clock, CheckCircle, Plus, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Activity, Client, calculateActivityStatus } from "@shared/schema";

export function Dashboard() {
  const { data: activities = [], isLoading: activitiesLoading } = useQuery<Activity[]>({
    queryKey: ['/api/activities'],
  });

  const { data: clients = [], isLoading: clientsLoading } = useQuery<Client[]>({
    queryKey: ['/api/clients'],
  });

  // Calculate real stats from API data
  const activitiesWithCalculatedStatus = activities.map(activity => ({
    ...activity,
    calculatedStatus: calculateActivityStatus(activity)
  }));

  const totalActivities = activitiesWithCalculatedStatus.length;
  const activeClients = clients.filter(client => client.ativo).length;
  const upcomingDeadlines = activitiesWithCalculatedStatus.filter(a => a.calculatedStatus === "vencimento_proximo").length;
  const overdue = activitiesWithCalculatedStatus.filter(a => a.calculatedStatus === "atrasada").length;

  if (activitiesLoading || clientsLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Carregando dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-dashboard-title">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Visão geral das atividades e clientes
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => console.log('Nova atividade')}
            data-testid="button-new-activity"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Atividade
          </Button>
          <Button
            variant="outline"
            onClick={() => console.log('Gerar relatório')}
            data-testid="button-generate-report"
          >
            <FileText className="w-4 h-4 mr-2" />
            Relatório
          </Button>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard 
          title="Total de Atividades" 
          value={totalActivities} 
          icon={ActivityIcon}
          description="Atividades ativas no sistema"
        />
        <DashboardCard 
          title="Clientes Ativos" 
          value={activeClients} 
          icon={Users}
          description="Clientes cadastrados"
          variant="success"
        />
        <DashboardCard 
          title="Próximas do Vencimento" 
          value={upcomingDeadlines} 
          icon={Clock}
          description="Próximos 3 dias"
          variant="warning"
        />
        <DashboardCard 
          title="Atrasadas" 
          value={overdue} 
          icon={CheckCircle}
          description="Requer atenção imediata"
          variant="danger"
        />
      </div>

      {/* Gráfico Resumo por Tipo de Serviço */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Atividades por Tipo de Serviço</CardTitle>
            <CardDescription>
              Distribuição das atividades por categoria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Mock chart data */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Geração</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-20 bg-chart-1 rounded-full"></div>
                  <span className="text-sm text-muted-foreground">10</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Monitoramento</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-16 bg-chart-2 rounded-full"></div>
                  <span className="text-sm text-muted-foreground">8</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Envio de Dados</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-12 bg-chart-4 rounded-full"></div>
                  <span className="text-sm text-muted-foreground">6</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atividades por Cliente</CardTitle>
            <CardDescription>
              Top 5 clientes com mais atividades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Mock client data */}
              {[
                { name: "João Silva", count: 6 },
                { name: "Maria Santos", count: 4 },
                { name: "Pedro Oliveira", count: 3 },
                { name: "Ana Costa", count: 3 },
                { name: "Carlos Lima", count: 2 }
              ].map((client, index) => (
                <div key={client.name} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{client.name}</span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="h-2 bg-primary rounded-full" 
                      style={{ width: `${client.count * 10}px` }}
                    ></div>
                    <span className="text-sm text-muted-foreground">{client.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Atividades Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
          <CardDescription>
            Lista das atividades mais recentes ou que requerem atenção
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ActivityTable />
        </CardContent>
      </Card>
    </div>
  );
}