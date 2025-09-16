import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Clientes
export const clients = pgTable("clients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nomeCompleto: text("nome_completo").notNull(),
  documento: text("documento").notNull().unique(), // CPF ou CNPJ
  endereco: text("endereco").notNull(),
  celular: text("celular").notNull(),
  numeroContrato: text("numero_contrato").notNull(),
  loginConcessionaria: text("login_concessionaria").notNull(),
  senhaConcessionaria: text("senha_concessionaria").notNull(),
  ativo: boolean("ativo").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Atividades
export const activities = pgTable("activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nome: text("nome").notNull(),
  tipoServico: text("tipo_servico").notNull(), // "Geração" | "Monitoramento" | "Envio de Dados"
  clienteId: varchar("cliente_id").references(() => clients.id).notNull(),
  dataVencimento: timestamp("data_vencimento").notNull(),
  observacoes: text("observacoes"),
  responsavel: text("responsavel"),
  tipoRecorrencia: text("tipo_recorrencia").notNull(), // "Mensal" | "Anual"
  intervaloRecorrencia: integer("intervalo_recorrencia").default(1).notNull(), // quantos meses/anos
  status: text("status").default("pendente").notNull(), // "pendente" | "concluida" | "atrasada"
  concluida: boolean("concluida").default(false).notNull(),
  dataConclusao: timestamp("data_conclusao"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Anexos
export const attachments = pgTable("attachments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  atividadeId: varchar("atividade_id").references(() => activities.id).notNull(),
  nomeArquivo: text("nome_arquivo").notNull(),
  urlArquivo: text("url_arquivo").notNull(),
  tipoArquivo: text("tipo_arquivo").notNull(), // "pdf" | "jpeg"
  tamanho: integer("tamanho").notNull(), // em bytes
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Schemas de inserção
export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  createdAt: true,
}).extend({
  documento: z.string()
    .min(1, "Documento é obrigatório")
    .max(50, "Documento muito longo"),
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
  status: true,
});

export const insertAttachmentSchema = createInsertSchema(attachments).omit({
  id: true,
  createdAt: true,
});

// Tipos
export type Client = typeof clients.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;
export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Attachment = typeof attachments.$inferSelect;
export type InsertAttachment = z.infer<typeof insertAttachmentSchema>;

// Public client type - excludes sensitive fields
export type PublicClient = Omit<Client, 'senhaConcessionaria'> & {
  documento: string; // This will be the masked version
};

// Enums
export const tipoServicoOptions = ["Geração", "Monitoramento", "Envio de Dados"] as const;
export const tipoRecorrenciaOptions = ["Mensal", "Anual"] as const;

// Utility function to calculate activity status based on due date
export function calculateActivityStatus(activity: Activity): ActivityStatus {
  // If already completed, return completed status
  if (activity.concluida) {
    return "concluida";
  }

  const now = new Date();
  const dueDate = new Date(activity.dataVencimento);
  const timeDiff = dueDate.getTime() - now.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

  // If overdue (past due date)
  if (daysDiff < 0) {
    return "atrasada";
  }
  
  // If due within 3 days (including today)
  if (daysDiff <= 3) {
    return "vencimento_proximo";
  }
  
  // Otherwise, it's on schedule
  return "em_dia";
}

// Activity Status type (matching StatusBadge)
export type ActivityStatus = "em_dia" | "vencimento_proximo" | "atrasada" | "concluida" | "pendente";

// Utility functions for document validation
export function validateCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, '');
  if (digits.length !== 11) return false;
  
  // Check for repeated digits
  if (/^(\d)\1{10}$/.test(digits)) return false;
  
  // Calculate check digits
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(digits[i]) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(digits[9])) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(digits[i]) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(digits[10])) return false;
  
  return true;
}

export function validateCNPJ(cnpj: string): boolean {
  const digits = cnpj.replace(/\D/g, '');
  if (digits.length !== 14) return false;
  
  // Check for repeated digits
  if (/^(\d)\1{13}$/.test(digits)) return false;
  
  // Calculate first check digit
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(digits[i]) * weights1[i];
  }
  let remainder = sum % 11;
  const digit1 = remainder < 2 ? 0 : 11 - remainder;
  if (digit1 !== parseInt(digits[12])) return false;
  
  // Calculate second check digit
  const weights2 = [6, 7, 8, 9, 2, 3, 4, 5, 6, 7, 8, 9];
  sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(digits[i]) * weights2[i];
  }
  sum += digit1 * 2;
  remainder = sum % 11;
  const digit2 = remainder < 2 ? 0 : 11 - remainder;
  if (digit2 !== parseInt(digits[13])) return false;
  
  return true;
}

export function validateDocument(documento: string): boolean {
  const digits = documento.replace(/\D/g, '');
  if (digits.length === 11) {
    return validateCPF(documento);
  } else if (digits.length === 14) {
    return validateCNPJ(documento);
  }
  return false;
}
export const statusOptions = ["pendente", "concluida", "atrasada"] as const;

// Utility function to mask document based on digits only
export function maskDocumentDigits(documento: string): string {
  const digits = documento.replace(/\D/g, '');
  
  if (digits.length === 11) {
    // CPF: XXX.***.XXX-XX -> format first and last parts only
    return `${digits.slice(0, 3)}.***.${digits.slice(6, 9)}-${digits.slice(9)}`;
  } else if (digits.length === 14) {
    // CNPJ: XX.***.***/****-XX -> format first and last parts only
    return `${digits.slice(0, 2)}.***.***/****-${digits.slice(12)}`;
  }
  
  return documento; // Return as is if not standard format
}

// Utility function to sanitize client data for public API responses
export function sanitizeClient(client: Client): PublicClient {
  const { senhaConcessionaria, ...publicData } = client;
  return {
    ...publicData,
    documento: maskDocumentDigits(client.documento)
  };
}

// === SISTEMA DE PROPOSTAS ===

// Potências do Sistema Fotovoltaico
export const potencias = pgTable("potencias", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  potencia: text("potencia").notNull(), // Ex: "5.94 kWp"
  materialAC: integer("material_ac").notNull(), // Preço do material AC em centavos
  descricaoEquipamentos: text("descricao_equipimentos").notNull(),
  precoCeramica: integer("preco_ceramica").notNull(), // Preço em centavos
  precoFibrocimento: integer("preco_fibrocimento").notNull(),
  precoLaje: integer("preco_laje").notNull(),
  precoSolo: integer("preco_solo").notNull(),
  precoMetalico: integer("preco_metalico").notNull(),
  estimativaGeracao: integer("estimativa_geracao").notNull(), // kWh/mês
  valorEconomia: integer("valor_economia").notNull(), // R$/mês em centavos
  ativo: boolean("ativo").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Cidades para Instalação
export const cidades = pgTable("cidades", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nome: text("nome").notNull().unique(),
  custoExtraDia: integer("custo_extra_dia").notNull(), // Custo extra por dia em centavos
  ativo: boolean("ativo").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Margens de Venda
export const margens = pgTable("margens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  descricao: text("descricao").notNull(),
  percentual: integer("percentual").notNull(), // Percentual * 100 (ex: 1500 = 15%)
  ativo: boolean("ativo").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Condições de Pagamento
export const condicoesPagamento = pgTable("condicoes_pagamento", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  condicao: text("condicao").notNull(),
  ativo: boolean("ativo").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Propostas Comerciais
export const propostas = pgTable("propostas", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Dados do Cliente
  nomeCliente: text("nome_cliente").notNull(),
  emailCliente: text("email_cliente").notNull(),
  telefoneCliente: text("telefone_cliente").notNull(),
  titularCliente: text("titular_cliente").notNull(),
  numeroContrato: text("numero_contrato").notNull(),
  enderecoCliente: text("endereco_cliente"),
  
  // Sistema Fotovoltaico
  potenciaId: varchar("potencia_id").references(() => potencias.id).notNull(),
  tipoTelhado: text("tipo_telhado").notNull(), // "ceramica" | "fibrocimento" | "laje" | "solo" | "metalico"
  diasInstalacao: integer("dias_instalacao").notNull(),
  
  // Local e Custos
  cidadeId: varchar("cidade_id").references(() => cidades.id).notNull(),
  margemId: varchar("margem_id").references(() => margens.id).notNull(),
  condicaoPagamentoId: varchar("condicao_pagamento_id").references(() => condicoesPagamento.id).notNull(),
  
  // Valores Calculados (em centavos)
  valorSistema: integer("valor_sistema").notNull(),
  materialAC: integer("material_ac").notNull(),
  maoObra: integer("mao_obra").notNull(),
  deslocamento: integer("deslocamento").notNull(),
  valorProjeto: integer("valor_projeto").notNull(),
  subtotal: integer("subtotal").notNull(),
  valorMargem: integer("valor_margem").notNull(),
  totalSemImposto: integer("total_sem_imposto").notNull(),
  valorImposto: integer("valor_imposto").notNull(),
  totalFinal: integer("total_final").notNull(),
  
  // Customizações
  valorFinalPersonalizado: integer("valor_final_personalizado"),
  margemRealObtida: integer("margem_real_obtida"), // Percentual * 100
  valorPorWp: integer("valor_por_wp"), // Valor por Wp em centavos
  
  // Vistoria (opcional)
  dataVistoria: timestamp("data_vistoria"),
  observacoesTecnicas: text("observacoes_tecnicas"),
  
  // Controle
  status: text("status").default("rascunho").notNull(), // "rascunho" | "enviada" | "aprovada" | "rejeitada"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Configurações Gerais do Sistema
export const configuracoes = pgTable("configuracoes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  chave: text("chave").notNull().unique(),
  valor: text("valor").notNull(),
  descricao: text("descricao"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// === SCHEMAS DE INSERÇÃO PARA PROPOSTAS ===

export const insertPotenciaSchema = createInsertSchema(potencias).omit({
  id: true,
  createdAt: true,
}).extend({
  potencia: z.string().min(1, "Potência é obrigatória"),
  materialAC: z.number().min(0, "Valor deve ser positivo"),
  precoCeramica: z.number().min(0, "Valor deve ser positivo"),
  precoFibrocimento: z.number().min(0, "Valor deve ser positivo"),
  precoLaje: z.number().min(0, "Valor deve ser positivo"),
  precoSolo: z.number().min(0, "Valor deve ser positivo"),
  precoMetalico: z.number().min(0, "Valor deve ser positivo"),
  estimativaGeracao: z.number().min(0, "Valor deve ser positivo"),
  valorEconomia: z.number().min(0, "Valor deve ser positivo"),
});

export const insertCidadeSchema = createInsertSchema(cidades).omit({
  id: true,
  createdAt: true,
}).extend({
  nome: z.string().min(1, "Nome da cidade é obrigatório"),
  custoExtraDia: z.number().min(0, "Valor deve ser positivo"),
});

export const insertMargemSchema = createInsertSchema(margens).omit({
  id: true,
  createdAt: true,
}).extend({
  descricao: z.string().min(1, "Descrição é obrigatória"),
  percentual: z.number().min(0, "Percentual deve ser positivo"),
});

export const insertCondicaoPagamentoSchema = createInsertSchema(condicoesPagamento).omit({
  id: true,
  createdAt: true,
}).extend({
  condicao: z.string().min(1, "Condição de pagamento é obrigatória"),
});

export const insertPropostaSchema = createInsertSchema(propostas).omit({
  id: true,
  createdAt: true,
  status: true,
}).extend({
  nomeCliente: z.string().min(1, "Nome do cliente é obrigatório"),
  emailCliente: z.string().email("Email inválido"),
  telefoneCliente: z.string().min(1, "Telefone é obrigatório"),
  titularCliente: z.string().min(1, "Titular é obrigatório"),
  numeroContrato: z.string().min(1, "Número do contrato é obrigatório"),
  diasInstalacao: z.number().min(1, "Dias de instalação deve ser positivo"),
  tipoTelhado: z.enum(["ceramica", "fibrocimento", "laje", "solo", "metalico"]),
});

export const insertConfiguracaoSchema = createInsertSchema(configuracoes).omit({
  id: true,
  updatedAt: true,
}).extend({
  chave: z.string().min(1, "Chave é obrigatória"),
  valor: z.string().min(1, "Valor é obrigatório"),
});

// === TIPOS PARA PROPOSTAS ===
export type Potencia = typeof potencias.$inferSelect;
export type InsertPotencia = z.infer<typeof insertPotenciaSchema>;
export type Cidade = typeof cidades.$inferSelect;
export type InsertCidade = z.infer<typeof insertCidadeSchema>;
export type Margem = typeof margens.$inferSelect;
export type InsertMargem = z.infer<typeof insertMargemSchema>;
export type CondicaoPagamento = typeof condicoesPagamento.$inferSelect;
export type InsertCondicaoPagamento = z.infer<typeof insertCondicaoPagamentoSchema>;
export type Proposta = typeof propostas.$inferSelect;
export type InsertProposta = z.infer<typeof insertPropostaSchema>;
export type Configuracao = typeof configuracoes.$inferSelect;
export type InsertConfiguracao = z.infer<typeof insertConfiguracaoSchema>;

// === ENUMS E OPÇÕES ===
export const tipoTelhadoOptions = ["ceramica", "fibrocimento", "laje", "solo", "metalico"] as const;
export const statusPropostaOptions = ["rascunho", "enviada", "aprovada", "rejeitada"] as const;

// === UTILITIES PARA PROPOSTAS ===
export function formatCurrency(centavos: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(centavos / 100);
}

export function parseCurrency(valor: string): number {
  // Remove R$, espaços, pontos e converte vírgula para ponto
  const numeroLimpo = valor.replace(/[R$\s.]/g, '').replace(',', '.');
  return Math.round(parseFloat(numeroLimpo) * 100); // Converte para centavos
}

export function formatPercentual(centesimos: number): string {
  return `${(centesimos / 100).toFixed(2)}%`;
}

export function calcularValorPorWp(totalFinal: number, potenciaKwp: number): number {
  const potenciaWp = potenciaKwp * 1000; // Converte kWp para Wp
  return Math.round(totalFinal / potenciaWp); // Valor por Wp em centavos
}
