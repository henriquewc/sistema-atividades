# 🚀 Guia Completo de Deploy - Sistema de Atividades

Este guia te ajudará a colocar o sistema rodando na sua VPS Ubuntu 22.04 de forma profissional e segura.

## 📋 Pré-requisitos

- VPS Ubuntu 22.04
- Acesso root ou sudo
- Domínio ou IP público (opcional para HTTPS)

## 🔧 Passo 1: Preparar o Servidor

### 1.1 Conectar na VPS
```bash
ssh root@SEU_IP_DA_VPS
# ou
ssh usuario@SEU_IP_DA_VPS
```

### 1.2 Atualizar o sistema
```bash
sudo apt update && sudo apt upgrade -y
```

### 1.3 Instalar Node.js 18+
```bash
# Instalar Node.js via NodeSource
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar instalação
node --version
npm --version
```

### 1.4 Instalar PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

### 1.5 Instalar Nginx
```bash
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
```

## 📁 Passo 2: Transferir os Arquivos

### 2.1 Criar diretório do projeto
```bash
sudo mkdir -p /var/www/sistema-atividades
sudo chown -R $USER:$USER /var/www/sistema-atividades
cd /var/www/sistema-atividades
```

### 2.2 Transferir arquivos (escolha uma opção):

**Opção A: Via Git (recomendado)**
```bash
# Se você tem o projeto no GitHub/GitLab
git clone SEU_REPOSITORIO_GIT .
```

**Opção B: Via SCP (do seu computador local)**
```bash
# Execute no seu computador local (não na VPS)
scp -r . usuario@SEU_IP_DA_VPS:/var/www/sistema-atividades/
```

**Opção C: Via rsync (do seu computador local)**
```bash
# Execute no seu computador local (não na VPS)
rsync -avz --exclude node_modules . usuario@SEU_IP_DA_VPS:/var/www/sistema-atividades/
```

## 🔨 Passo 3: Instalar e Configurar

### 3.1 Voltar para a VPS e instalar dependências
```bash
cd /var/www/sistema-atividades
npm install
```

### 3.2 Configurar variáveis de ambiente
```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar configurações (IMPORTANTE: altere a SESSION_SECRET!)
nano .env
```

### 3.3 Fazer o build da aplicação
```bash
npm run build
```

### ⚠️ SEGURANÇA IMPORTANTE
**ANTES DE COLOCAR EM PRODUÇÃO:**
1. Altere a `SESSION_SECRET` no arquivo `.env`
2. Considere alterar as credenciais de login padrão (admin/admin123)
3. Configure firewall e SSL (veja seção opcional no final)

## 🚀 Passo 4: Iniciar com PM2

### 4.1 Iniciar a aplicação
```bash
pm2 start ecosystem.config.cjs
```

### 4.2 Configurar PM2 para iniciar automaticamente
```bash
pm2 startup
pm2 save
```

### 4.3 Verificar status
```bash
pm2 status
pm2 logs sistema-atividades
```

## 🌐 Passo 5: Configurar Nginx

### 5.1 Criar configuração do site
```bash
sudo nano /etc/nginx/sites-available/sistema-atividades
```

### 5.2 Adicionar esta configuração:
```nginx
server {
    listen 80;
    server_name SEU_DOMINIO.com;  # ou substitua pelo seu IP

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5.3 Ativar o site
```bash
sudo ln -s /etc/nginx/sites-available/sistema-atividades /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 🔒 Passo 6: Configurar Firewall (Segurança)

```bash
# Permitir conexões SSH, HTTP e HTTPS
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

## 🎉 Passo 7: Testar a Aplicação

### 7.1 Verificar se está funcionando
```bash
# Testar localmente na VPS
curl http://localhost:5000

# Ver logs em tempo real
pm2 logs sistema-atividades
```

### 7.2 Acessar pelo navegador
- Acesse: `http://SEU_IP_DA_VPS` ou `http://SEU_DOMINIO.com`
- Login: `admin`
- Senha: `admin123`

## 🔄 Comandos Úteis para Manutenção

```bash
# Ver status da aplicação
pm2 status

# Ver logs
pm2 logs sistema-atividades

# Reiniciar aplicação
pm2 restart sistema-atividades

# Parar aplicação
pm2 stop sistema-atividades

# Fazer deploy de uma nova versão (use o script automático)
./deploy.sh
```

## 🚨 Solução de Problemas

### Aplicação não inicia
```bash
# Verificar logs de erro
pm2 logs sistema-atividades --err

# Verificar se a porta 5000 está ocupada
sudo netstat -tulpn | grep 5000

# Reiniciar PM2 completamente
pm2 kill
pm2 start ecosystem.config.cjs
```

### Nginx não funciona
```bash
# Verificar configuração
sudo nginx -t

# Ver logs do Nginx
sudo tail -f /var/log/nginx/error.log

# Reiniciar Nginx
sudo systemctl restart nginx
```

### Não consegue acessar pelo IP
```bash
# Verificar se o firewall está bloqueando
sudo ufw status

# Verificar se o Nginx está rodando
sudo systemctl status nginx
```

## 🔐 Opcional: Configurar HTTPS (SSL)

Se você tiver um domínio, pode configurar SSL gratuito:

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obter certificado SSL
sudo certbot --nginx -d SEU_DOMINIO.com

# Configurar renovação automática
sudo crontab -e
# Adicionar esta linha:
# 0 12 * * * /usr/bin/certbot renew --quiet
```

## ✅ Pronto!

Sua aplicação está rodando profissionalmente na VPS! 🎉

**Acessos:**
- **URL:** http://SEU_IP_DA_VPS (ou seu domínio)
- **Login:** admin
- **Senha:** admin123

**Para fazer atualizações futuras:**
1. Envie os arquivos atualizados para a VPS
2. Execute: `./deploy.sh`

---

### 📞 Precisa de ajuda?
Se algo não funcionar, me mande o resultado destes comandos:
```bash
pm2 logs sistema-atividades
sudo systemctl status nginx
curl http://localhost:5000
```