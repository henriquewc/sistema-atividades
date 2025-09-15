import { DashboardCard } from '../DashboardCard';
import { Activity, Users, Clock, CheckCircle } from 'lucide-react';

export default function DashboardCardExample() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 p-4">
      <DashboardCard 
        title="Total de Atividades" 
        value={24} 
        icon={Activity}
        description="Atividades ativas"
      />
      <DashboardCard 
        title="Clientes Ativos" 
        value={8} 
        icon={Users}
        description="Clientes cadastrados"
        variant="success"
      />
      <DashboardCard 
        title="Próximas do Vencimento" 
        value={3} 
        icon={Clock}
        description="Próximos 5 dias"
        variant="warning"
      />
      <DashboardCard 
        title="Atrasadas" 
        value={2} 
        icon={CheckCircle}
        description="Requer atenção"
        variant="danger"
      />
    </div>
  );
}