import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function LogoutButton() {
  const { logout } = useAuth();

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={logout}
      data-testid="button-logout"
      title="Sair do sistema"
    >
      <LogOut className="w-4 h-4" />
    </Button>
  );
}