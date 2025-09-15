import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, AlertTriangle, Calendar } from "lucide-react";

export type ActivityStatus = "em_dia" | "vencimento_proximo" | "atrasada" | "concluida" | "pendente";

interface StatusBadgeProps {
  status: ActivityStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig = {
    pendente: {
      label: "Em dia",
      variant: "default" as const,
      icon: Calendar,
      bgColor: "bg-chart-1/10 text-chart-1",
    },
    em_dia: {
      label: "Em dia",
      variant: "default" as const,
      icon: Calendar,
      bgColor: "bg-chart-1/10 text-chart-1",
    },
    vencimento_proximo: {
      label: "Vencimento próximo",
      variant: "secondary" as const,
      icon: Clock,
      bgColor: "bg-chart-2/10 text-chart-2",
    },
    atrasada: {
      label: "Atrasada",
      variant: "destructive" as const,
      icon: AlertTriangle,
      bgColor: "bg-chart-3/10 text-chart-3",
    },
    concluida: {
      label: "Concluída",
      variant: "secondary" as const,
      icon: CheckCircle,
      bgColor: "bg-chart-5/10 text-chart-5",
    },
  };

  const config = statusConfig[status];
  
  // Se o status não existir, usar um padrão
  if (!config) {
    return (
      <Badge variant="secondary" className={className}>
        Status desconhecido
      </Badge>
    );
  }

  const Icon = config.icon;

  return (
    <Badge 
      variant={config.variant} 
      className={`${config.bgColor} border-0 ${className}`}
      data-testid={`status-${status}`}
    >
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  );
}