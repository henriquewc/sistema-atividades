import { type Client, type InsertClient, type Activity, type InsertActivity, calculateActivityStatus } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Clients
  getClient(id: string): Promise<Client | undefined>;
  getAllClients(): Promise<Client[]>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: string, client: Partial<InsertClient>): Promise<Client | undefined>;
  
  // Activities
  getActivity(id: string): Promise<Activity | undefined>;
  getAllActivities(): Promise<Activity[]>;
  getActivitiesByClient(clientId: string): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  updateActivity(id: string, activity: Partial<Activity>): Promise<Activity | undefined>;
  completeActivity(id: string): Promise<Activity | undefined>;
}

export class MemStorage implements IStorage {
  private clients: Map<string, Client>;
  private activities: Map<string, Activity>;

  constructor() {
    this.clients = new Map();
    this.activities = new Map();
    this.seedData();
  }

  private seedData() {
    // Criar alguns clientes mock
    const client1: Client = {
      id: "1",
      nomeCompleto: "João Silva",
      documento: "12345678909", // CPF válido (digits only)
      endereco: "Rua das Flores, 123 - São Paulo, SP",
      celular: "(11) 99999-9999",
      numeroContrato: "CON-001",
      loginConcessionaria: "joao.silva",
      senhaConcessionaria: "senha123",
      ativo: true,
      createdAt: new Date(),
    };

    const client2: Client = {
      id: "2",
      nomeCompleto: "Maria Santos",
      documento: "11144477735", // CPF válido (digits only)
      endereco: "Av. Principal, 456 - Rio de Janeiro, RJ",
      celular: "(11) 88888-8888",
      numeroContrato: "CON-002",
      loginConcessionaria: "maria.santos",
      senhaConcessionaria: "senha456",
      ativo: true,
      createdAt: new Date(),
    };

    const client3: Client = {
      id: "3",
      nomeCompleto: "Pedro Oliveira",
      documento: "22233344488", // CPF válido (digits only)
      endereco: "Rua do Comércio, 789 - Belo Horizonte, MG",
      celular: "(11) 77777-7777",
      numeroContrato: "CON-003",
      loginConcessionaria: "pedro.oliveira",
      senhaConcessionaria: "senha789",
      ativo: false,
      createdAt: new Date(),
    };

    const client4: Client = {
      id: "4",
      nomeCompleto: "Empresa ABC Ltda",
      documento: "11222333000181", // CNPJ válido (digits only)
      endereco: "Av. Comercial, 1000 - Porto Alegre, RS",
      celular: "(51) 3333-4444",
      numeroContrato: "CON-004",
      loginConcessionaria: "empresa.abc",
      senhaConcessionaria: "senhaABC",
      ativo: true,
      createdAt: new Date(),
    };

    this.clients.set(client1.id, client1);
    this.clients.set(client2.id, client2);
    this.clients.set(client3.id, client3);
    this.clients.set(client4.id, client4);

    // Criar algumas atividades mock com diferentes datas para testar status
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const lastWeek = new Date(now);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const activity1: Activity = {
      id: "1",
      nome: "Geração de Relatório Mensal",
      tipoServico: "Geração",
      clienteId: "1",
      dataVencimento: tomorrow, // Vencimento próximo (1 dia)
      observacoes: "Relatório mensal de consumo",
      responsavel: "Ana Costa",
      tipoRecorrencia: "Mensal",
      intervaloRecorrencia: 1,
      status: "pendente",
      concluida: false,
      dataConclusao: null,
      createdAt: new Date(),
    };

    const activity2: Activity = {
      id: "2",
      nome: "Monitoramento Consumo Energia",
      tipoServico: "Monitoramento", 
      clienteId: "2",
      dataVencimento: lastWeek, // Atrasada (7 dias atrás)
      observacoes: "Monitoramento diário",
      responsavel: "Carlos Lima",
      tipoRecorrencia: "Mensal",
      intervaloRecorrencia: 1,
      status: "atrasada",
      concluida: false,
      dataConclusao: null,
      createdAt: new Date(),
    };

    const activity3: Activity = {
      id: "3",
      nome: "Envio Dados Consumo",
      tipoServico: "Envio de Dados",
      clienteId: "3", 
      dataVencimento: nextWeek, // Em dia (7 dias)
      observacoes: "Envio para concessionária",
      responsavel: "Ana Costa",
      tipoRecorrencia: "Mensal",
      intervaloRecorrencia: 1,
      status: "pendente",
      concluida: false,
      dataConclusao: null,
      createdAt: new Date(),
    };

    const activity4: Activity = {
      id: "4",
      nome: "Relatório Trimestral",
      tipoServico: "Geração",
      clienteId: "1",
      dataVencimento: new Date("2024-12-30"),
      observacoes: "Relatório completo trimestral",
      responsavel: "Ana Costa",
      tipoRecorrencia: "Mensal",
      intervaloRecorrencia: 3,
      status: "concluida",
      concluida: true,
      dataConclusao: new Date("2024-12-28"),
      createdAt: new Date("2024-10-01"),
    };

    this.activities.set(activity1.id, activity1);
    this.activities.set(activity2.id, activity2);
    this.activities.set(activity3.id, activity3);
    this.activities.set(activity4.id, activity4);
  }

  // Clients
  async getClient(id: string): Promise<Client | undefined> {
    return this.clients.get(id);
  }

  async getAllClients(): Promise<Client[]> {
    return Array.from(this.clients.values());
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const id = randomUUID();
    const client: Client = {
      ...insertClient,
      id,
      ativo: insertClient.ativo ?? true,
      createdAt: new Date(),
    };
    this.clients.set(id, client);
    return client;
  }

  async updateClient(id: string, updateData: Partial<InsertClient>): Promise<Client | undefined> {
    const client = this.clients.get(id);
    if (!client) return undefined;
    
    const updatedClient = { ...client, ...updateData };
    this.clients.set(id, updatedClient);
    return updatedClient;
  }

  // Activities
  async getActivity(id: string): Promise<Activity | undefined> {
    const activity = this.activities.get(id);
    if (!activity) return undefined;
    
    // Update status based on due date if not completed
    if (!activity.concluida) {
      const calculatedStatus = calculateActivityStatus(activity);
      if (activity.status !== calculatedStatus) {
        const updatedActivity = { ...activity, status: calculatedStatus };
        this.activities.set(id, updatedActivity);
        return updatedActivity;
      }
    }
    return activity;
  }

  async getAllActivities(): Promise<Activity[]> {
    const activities = Array.from(this.activities.values());
    // Update statuses based on due dates
    return activities.map(activity => {
      if (!activity.concluida) {
        const calculatedStatus = calculateActivityStatus(activity);
        // Update the stored activity if status changed
        if (activity.status !== calculatedStatus) {
          const updatedActivity = { ...activity, status: calculatedStatus };
          this.activities.set(activity.id, updatedActivity);
          return updatedActivity;
        }
      }
      return activity;
    });
  }

  async getActivitiesByClient(clientId: string): Promise<Activity[]> {
    const activities = Array.from(this.activities.values()).filter(
      activity => activity.clienteId === clientId
    );
    
    // Update statuses based on due dates
    return activities.map(activity => {
      if (!activity.concluida) {
        const calculatedStatus = calculateActivityStatus(activity);
        // Update the stored activity if status changed
        if (activity.status !== calculatedStatus) {
          const updatedActivity = { ...activity, status: calculatedStatus };
          this.activities.set(activity.id, updatedActivity);
          return updatedActivity;
        }
      }
      return activity;
    });
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = randomUUID();
    const activity: Activity = {
      ...insertActivity,
      id,
      intervaloRecorrencia: insertActivity.intervaloRecorrencia ?? 1,
      observacoes: insertActivity.observacoes ?? null,
      responsavel: insertActivity.responsavel ?? null,
      status: "pendente",
      concluida: false,
      dataConclusao: null,
      createdAt: new Date(),
    };
    this.activities.set(id, activity);
    return activity;
  }

  async updateActivity(id: string, updateData: Partial<Activity>): Promise<Activity | undefined> {
    const activity = this.activities.get(id);
    if (!activity) return undefined;
    
    const updatedActivity = { ...activity, ...updateData };
    this.activities.set(id, updatedActivity);
    return updatedActivity;
  }

  async completeActivity(id: string): Promise<Activity | undefined> {
    const activity = this.activities.get(id);
    if (!activity) return undefined;
    
    const completedActivity = {
      ...activity,
      status: "concluida" as const,
      concluida: true,
      dataConclusao: new Date(),
    };
    this.activities.set(id, completedActivity);
    return completedActivity;
  }
}

export const storage = new MemStorage();
