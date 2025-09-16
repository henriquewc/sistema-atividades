import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, FileText, Settings, BarChart3 } from "lucide-react";

export default function PropostasPage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sistema de Propostas</h1>
          <p className="text-muted-foreground">Geração e gestão de propostas comerciais</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard" className="flex items-center gap-2" data-testid="tab-dashboard">
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="nova-proposta" className="flex items-center gap-2" data-testid="tab-nova-proposta">
            <Calculator className="h-4 w-4" />
            Nova Proposta
          </TabsTrigger>
          <TabsTrigger value="propostas" className="flex items-center gap-2" data-testid="tab-propostas">
            <FileText className="h-4 w-4" />
            Propostas Geradas
          </TabsTrigger>
          <TabsTrigger value="configuracoes" className="flex items-center gap-2" data-testid="tab-configuracoes">
            <Settings className="h-4 w-4" />
            Configurações
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Propostas</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-total-propostas">0</div>
                <p className="text-xs text-muted-foreground">+0% em relação ao mês anterior</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
                <Calculator className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-valor-total">R$ 0,00</div>
                <p className="text-xs text-muted-foreground">Valor total das propostas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Valor Médio</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-valor-medio">R$ 0,00</div>
                <p className="text-xs text-muted-foreground">Valor médio por proposta</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Propostas Recentes</CardTitle>
              <CardDescription>Últimas propostas geradas no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>Nenhuma proposta gerada ainda.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Nova Proposta Tab */}
        <TabsContent value="nova-proposta" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gerar Nova Proposta</CardTitle>
              <CardDescription>Preencha os dados para gerar uma nova proposta comercial</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Calculator className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>Formulário de nova proposta será implementado em breve.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Propostas Geradas Tab */}
        <TabsContent value="propostas" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Propostas Geradas</CardTitle>
              <CardDescription>Visualizar e gerenciar todas as propostas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>Nenhuma proposta cadastrada ainda.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações Tab */}
        <TabsContent value="configuracoes" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Potências e Preços</CardTitle>
                <CardDescription>Configurar potências disponíveis e seus preços</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4 text-muted-foreground">
                  <p>Nenhuma potência cadastrada.</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cidades</CardTitle>
                <CardDescription>Configurar cidades e custos extras</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4 text-muted-foreground">
                  <p>Nenhuma cidade cadastrada.</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Margens de Venda</CardTitle>
                <CardDescription>Configurar margens de lucro</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4 text-muted-foreground">
                  <p>Nenhuma margem cadastrada.</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Condições de Pagamento</CardTitle>
                <CardDescription>Configurar opções de pagamento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4 text-muted-foreground">
                  <p>Nenhuma condição cadastrada.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}