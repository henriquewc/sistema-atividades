import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { LoginForm } from "@/components/LoginForm";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return <>{children}</>;
}