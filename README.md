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
git clone https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git
cd NOME_DO_REPOSITORIO

# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev
```

A aplicação estará disponível em: http://localhost:5000

### Configuração Inicial
1. Copie `.env.example` para `.env` e configure suas variáveis
2. **Login de Demonstração:** admin / admin123 (⚠️ **ALTERE EM PRODUÇÃO!**)

## 📦 Deploy em Produção

Para fazer deploy em um servidor VPS Ubuntu 22.04, siga o guia completo em [`DEPLOY_GUIDE.md`](./DEPLOY_GUIDE.md).

### Build para Produção
```bash
# Fazer build
npm run build

# Executar em produção
npm start
```

## 📁 Estrutura do Projeto

```
├── client/          # Frontend React
├── server/          # Backend Express  
├── shared/          # Schemas compartilhados
├── deploy.sh        # Script de deploy automático
├── ecosystem.config.cjs  # Configuração PM2
└── DEPLOY_GUIDE.md  # Guia completo de deploy
```

## 🎨 Design System

- **Cores Principais**: Laranja (#f97316), Verde (#22c55e), Cinza (#6b7280)
- **Tipografia**: Inter (Google Fonts)
- **Componentes**: Shadcn/ui + Radix UI
- **Tema**: Suporte a modo claro/escuro

## 📋 Status das Atividades

- 🟢 **Em Dia**: Atividades dentro do prazo
- 🟡 **Vencimento Próximo**: Vencem em até 7 dias  
- 🔴 **Atrasada**: Atividades em atraso
- ✅ **Concluída**: Atividades finalizadas

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

⭐ **Se este projeto te ajudou, deixe uma estrela!**