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

## 🚀 Instalação Rápida

### Desenvolvimento Local

```bash
# 1. Clonar o repositório
git clone https://github.com/SEU_USUARIO/sistema-atividades.git
cd sistema-atividades

# 2. Instalar dependências
npm install

# 3. Executar em modo desenvolvimento
npm run dev
```

**Acesso:** http://localhost:5000  
**Login:** admin / admin123

## 🌐 Deploy em VPS (Ubuntu 22.04)

### Deploy Automático

```bash
# 1. Clonar repositório na VPS
git clone https://github.com/SEU_USUARIO/sistema-atividades.git
cd sistema-atividades

# 2. Dar permissão de execução
chmod +x deploy.sh

# 3. Executar deploy automático
sudo ./deploy.sh
```

### O que o script faz:

- ✅ Instala Node.js 20
- ✅ Instala PM2 para gerenciamento de processos
- ✅ Configura Nginx como proxy reverso
- ✅ Configura firewall básico
- ✅ Cria variáveis de ambiente
- ✅ Faz build e inicia a aplicação
- ✅ Configura auto-start no boot

### Acesso após deploy:

**URL:** `http://SEU_IP_VPS:8080`  
**Login:** admin / admin123

## 📦 Deploy Manual (Avançado)

### Pré-requisitos

```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar dependências
sudo apt install -y curl wget git nginx

# Instalar Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar PM2
sudo npm install -g pm2
```

### Configuração da aplicação

```bash
# Instalar dependências do projeto
npm ci --production=false

# Fazer build
npm run build

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env conforme necessário

# Iniciar com PM2
pm2 start ecosystem.config.cjs
pm2 startup
pm2 save
```

### Configuração do Nginx

```bash
# Criar configuração
sudo nano /etc/nginx/sites-available/sistema-atividades
```

Conteúdo do arquivo:

```nginx
server {
    listen 8080;
    server_name _;
    
    # Headers de segurança
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    location / {
        proxy_pass http://127.0.0.1:5000/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

```bash
# Ativar configuração
sudo ln -s /etc/nginx/sites-available/sistema-atividades /etc/nginx/sites-enabled/

# Testar e recarregar
sudo nginx -t
sudo systemctl reload nginx
```

## 🔧 Comandos Úteis

### PM2

```bash
pm2 status              # Ver status da aplicação
pm2 logs                # Ver logs em tempo real
pm2 restart all         # Reiniciar aplicação
pm2 stop all            # Parar aplicação
pm2 delete all          # Remover aplicação do PM2
```

### Nginx

```bash
sudo nginx -t                    # Testar configuração
sudo systemctl reload nginx     # Recarregar configuração
sudo systemctl restart nginx    # Reiniciar Nginx
sudo systemctl status nginx     # Ver status do Nginx
```

### Sistema

```bash
# Ver uso de recursos
htop

# Ver portas em uso
sudo netstat -tlnp

# Ver logs do sistema
sudo journalctl -u nginx
sudo journalctl -f
```

## 🔒 Segurança

### Configurações Recomendadas

1. **Alterar senha padrão**
2. **Configurar firewall**
   ```bash
   sudo ufw enable
   sudo ufw allow 22/tcp    # SSH
   sudo ufw allow 8080/tcp  # Aplicação
   ```

3. **Configurar SSL (opcional)**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d seu-dominio.com
   ```

## 🐛 Troubleshooting

### Problemas Comuns

**Aplicação não inicia:**
```bash
# Verificar logs
pm2 logs

# Verificar se porta está livre
sudo netstat -tlnp | grep :5000
```

**Nginx retorna 502:**
```bash
# Verificar se app está rodando
curl http://localhost:5000

# Verificar configuração nginx
sudo nginx -t
```

**Porta 8080 não acessível:**
```bash
# Verificar firewall
sudo ufw status

# Liberar porta
sudo ufw allow 8080/tcp
```

### Logs Importantes

```bash
# Logs da aplicação
pm2 logs

# Logs do Nginx
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Logs do sistema
sudo journalctl -u nginx -f
```

## 📁 Estrutura do Projeto

```
sistema-atividades/
├── client/                  # Frontend React
│   ├── src/
│   └── dist/               # Build do frontend
├── server/                 # Backend Express
│   ├── index.ts           # Arquivo principal
│   └── dist/              # Build do backend
├── shared/                # Schemas compartilhados
├── deploy.sh              # Script de deploy automático
├── ecosystem.config.cjs   # Configuração PM2
├── .env.example          # Exemplo de variáveis de ambiente
└── README.md             # Este arquivo
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

## 🔄 Atualizações

Para atualizar o sistema:

```bash
# 1. Parar aplicação
pm2 stop all

# 2. Atualizar código
git pull origin main

# 3. Instalar dependências (se houver)
npm ci --production=false

# 4. Rebuild
npm run build

# 5. Reiniciar
pm2 restart all
```

## 📝 Commit das Mudanças

Após fazer as modificações no projeto, faça commit e push:

```bash
# Adicionar arquivos modificados
git add .

# Fazer commit
git commit -m "feat: Deploy automático completo com scripts e documentação

- Script deploy.sh automatizado para Ubuntu 22.04
- README.md atualizado com instruções detalhadas
- Template nginx.conf com múltiplas opções
- Script de limpeza do banco para produção
- Configuração PM2 otimizada
- Arquivo .env.example completo
- Permissões de execução configuradas"

# Push para repositório
git push origin main
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

## 📞 Suporte

Em caso de problemas:

1. Verifique os logs: `pm2 logs`
2. Teste a aplicação: `curl http://localhost:5000`
3. Verifique o nginx: `sudo nginx -t`
4. Consulte a seção de troubleshooting

⭐ **Se este projeto te ajudou, deixe uma estrela!**