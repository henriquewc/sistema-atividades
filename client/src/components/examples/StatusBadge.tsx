import { StatusBadge } from '../StatusBadge';

export default function StatusBadgeExample() {
  return (
    <div className="flex flex-wrap gap-2 p-4">
      <StatusBadge status="em_dia" />
      <StatusBadge status="vencimento_proximo" />
      <StatusBadge status="atrasada" />
      <StatusBadge status="concluida" />
    </div>
  );
}