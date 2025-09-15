import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import { FileText, Download, Filter } from "lucide-react";
import { useState } from "react";

export default function ReportsPage() {
  const [reportType, setReportType] = useState("");
  const [dateRange, setDateRange] = useState<{from: Date | undefined, to: Date | undefined}>({
    from: undefined,
    to: undefined
  });

  const generateReport = (format: "excel" | "pdf") => {
    console.log(`Gerando relatório em ${format.toUpperCase()}:`, {
      type: reportType,
      dateRange,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-reports-title">
          Relatórios
        </h1>
        <p className="text-muted-foreground">
          Gere relatórios personalizados das atividades e clientes
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Configurações do Relatório */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Configurar Relatório
            </CardTitle>
            <CardDescription>
              Selecione os filtros para gerar seu relatório
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Relatório</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger data-testid="select-report-type">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activities">Relatório de Atividades</SelectItem>
                  <SelectItem value="clients">Relatório de Clientes</SelectItem>
                  <SelectItem value="overdue">Atividades Atrasadas</SelectItem>
                  <SelectItem value="summary">Resumo Geral</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Período</label>
              <DatePickerWithRange 
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                onClick={() => generateReport("excel")}
                disabled={!reportType}
                className="flex-1"
                data-testid="button-generate-excel"
              >
                <FileText className="w-4 h-4 mr-2" />
                Excel
              </Button>
              <Button 
                onClick={() => generateReport("pdf")}
                disabled={!reportType}
                variant="outline"
                className="flex-1"
                data-testid="button-generate-pdf"
              >
                <Download className="w-4 h-4 mr-2" />
                PDF
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Relatórios Recentes */}
        <Card>
          <CardHeader>
            <CardTitle>Relatórios Recentes</CardTitle>
            <CardDescription>
              Acesse relatórios gerados anteriormente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Mock de relatórios recentes */}
              {[
                { name: "Atividades - Dezembro 2024", date: "15/01/2025", format: "Excel" },
                { name: "Clientes Ativos", date: "10/01/2025", format: "PDF" },
                { name: "Resumo Anual 2024", date: "02/01/2025", format: "Excel" },
              ].map((report, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover-elevate">
                  <div>
                    <p className="font-medium text-sm">{report.name}</p>
                    <p className="text-xs text-muted-foreground">{report.date} - {report.format}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => console.log('Baixar relatório:', report.name)}
                    data-testid={`button-download-${index}`}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estatísticas Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Estatísticas Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">24</div>
              <div className="text-sm text-muted-foreground">Total Atividades</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-chart-1">18</div>
              <div className="text-sm text-muted-foreground">Concluídas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-chart-2">3</div>
              <div className="text-sm text-muted-foreground">Próximas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-chart-3">2</div>
              <div className="text-sm text-muted-foreground">Atrasadas</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}