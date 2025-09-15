import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertClientSchema, insertActivitySchema, sanitizeClient } from "@shared/schema";


export async function registerRoutes(app: Express): Promise<Server> {
  // Clients routes
  app.get("/api/clients", async (req, res) => {
    try {
      const clients = await storage.getAllClients();
      const sanitizedClients = clients.map(client => sanitizeClient(client));
      res.json(sanitizedClients);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar clientes" });
    }
  });

  app.get("/api/clients/:id", async (req, res) => {
    try {
      const client = await storage.getClient(req.params.id);
      if (!client) {
        return res.status(404).json({ error: "Cliente não encontrado" });
      }
      res.json(sanitizeClient(client));
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar cliente" });
    }
  });

  app.get("/api/clients/:id/activities", async (req, res) => {
    try {
      const activities = await storage.getActivitiesByClient(req.params.id);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar atividades do cliente" });
    }
  });

  app.post("/api/clients", async (req, res) => {
    try {
      const validatedData = insertClientSchema.parse(req.body);
      const client = await storage.createClient(validatedData);
      res.status(201).json(sanitizeClient(client));
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos para criar cliente" });
    }
  });

  // Activities routes
  app.get("/api/activities", async (req, res) => {
    try {
      const activities = await storage.getAllActivities();
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar atividades" });
    }
  });

  app.get("/api/activities/:id", async (req, res) => {
    try {
      const activity = await storage.getActivity(req.params.id);
      if (!activity) {
        return res.status(404).json({ error: "Atividade não encontrada" });
      }
      res.json(activity);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar atividade" });
    }
  });

  app.post("/api/activities", async (req, res) => {
    try {
      const validatedData = insertActivitySchema.parse(req.body);
      const activity = await storage.createActivity(validatedData);
      res.status(201).json(activity);
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos para criar atividade" });
    }
  });

  app.post("/api/activities/:id/complete", async (req, res) => {
    try {
      const activity = await storage.completeActivity(req.params.id);
      if (!activity) {
        return res.status(404).json({ error: "Atividade não encontrada" });
      }
      res.json(activity);
    } catch (error) {
      res.status(500).json({ error: "Erro ao marcar atividade como concluída" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
