import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from '../AppSidebar';

export default function AppSidebarExample() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex-1 p-4">
          <h2 className="text-lg font-semibold">Conteúdo principal aqui</h2>
          <p className="text-muted-foreground">Este é um exemplo da sidebar em funcionamento.</p>
        </div>
      </div>
    </SidebarProvider>
  );
}