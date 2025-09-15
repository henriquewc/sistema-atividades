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
    .min(11, "Documento deve ter pelo menos 11 dígitos (CPF)")
    .max(18, "Documento inválido")
    .refine((doc) => validateDocument(doc), {
      message: "CPF ou CNPJ inválido"
    })
    .transform((doc) => doc.replace(/\D/g, '')), // Normalize to digits only for storage
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
