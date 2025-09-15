# 📋 Sistema de Acompanhamento de Atividades

Sistema completo para gerenciamento de atividades mensais e anuais com controle de prazos, alertas visuais, histórico de clientes e relatórios.

## ✨ Funcionalidades

- **🔐 Login Seguro**: Sistema de autenticação com credenciais admin/admin123
- **📊 Dashboard**: Visão geral das atividades com métricas e cartões informativos
- **📝 Gestão de Atividades**: Criação, edição e acompanhamento de tarefas recorrentes
- **👥 Gestão de Clientes**: Cadastro completo com validação de CPF/CNPJ
- **🚨 Status Automático**: Cálculo automático baseado em datas de vencimento
- **📈 Relatórios**: Geração de relatórios configuráveis por período
- **📱 Design Responsivo**: Interface otimizada para desktop e mobile

## 🛠️ Tecnologias

### Frontend
- **React 18** com TypeScript
- **Tailwind CSS** + Shadcn/ui
- **React Query** para gerenciamento de estado
- **React Hook Form** + Zod para validação
- **Wouter** para roteamento

### Backend  
- **Node.js** + Express + TypeScript
- **Armazenamento em memória** (MemStorage)
- **Drizzle ORM** (preparado para PostgreSQL)

## 🚀 Executar Localmente

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação
```bash
# Clonar o repositório
git clone https://github.com/henriquewc/Verdisolucoes.git
cd Verdisolucoes

# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev
