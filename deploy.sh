#!/bin/bash

# Script de Deploy Automático - Sistema de Atividades
# Ubuntu 22.04 LTS - Versão completa

set -e

echo "🚀 Deploy Automático - Sistema de Atividades"
echo "============================================="

# Função para log colorido
log() {
    echo -e "\e[32m[$(date '+%H:%M:%S')] $1\e[0m"
}

error() {
    echo -e "\e[31m[ERRO] $1\e[0m"
    exit 1
}

# Verificar se está rodando como root
if [ "$EUID" -ne 0 ]; then
    error "Execute como root: sudo ./deploy.sh"
fi

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    error "Execute este script na raiz do projeto (onde está o package.json)"
fi

# Obter IP do servidor
SERVER_IP=$(hostname -I | awk '{print $1}')

log "🔍 Verificando sistema..."
log "IP do servidor: $SERVER_IP"
log "Sistema: $(lsb_release -d | cut -f2)"

# 1. INSTALAR DEPENDÊNCIAS DO SISTEMA
log "📦 Instalando dependências do sistema..."
apt update
apt install -y curl wget git nginx

# 2. INSTALAR NODE.JS 20
if ! command -v node &> /dev/null; then
    log "📦 Instalando Node.js 20..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
fi

node_version=$(node --version)
log "Node.js instalado: $node_version"

# 3. INSTALAR PM2 GLOBALMENTE
if ! command -v pm2 &> /dev/null; then
    log "📦 Instalando PM2..."
    npm install -g pm2
fi

# 4. INSTALAR DEPENDÊNCIAS DO PROJETO
log "📦 Instalando dependências do projeto..."
npm ci --production=false

# 5. BUILD DA APLICAÇÃO
log "🔨 Fazendo build da aplicação..."
npm run build

if [ ! -d "dist" ]; then
    error "Build falhou - diretório dist não foi criado"
fi

log "✅ Build concluído!"

# 6. CONFIGURAR NGINX
log "🌐 Configurando Nginx..."

# Remover configurações antigas se existirem
rm -f /etc/nginx/sites-enabled/*atividades*
rm -f /etc/nginx/sites-enabled/porta8080

# Criar nova configuração
cat > /etc/nginx/sites-available/sistema-atividades << 'EOF'
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
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
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
EOF

# Ativar configuração
ln -sf /etc/nginx/sites-available/sistema-atividades /etc/nginx/sites-enabled/

# Testar configuração
nginx -t || error "Configuração do Nginx inválida"

# Recarregar Nginx
systemctl reload nginx

log "✅ Nginx configurado!"

# 7. CONFIGURAR VARIÁVEIS DE AMBIENTE
log "🔧 Configurando variáveis de ambiente..."
if [ ! -f ".env" ]; then
    cat > .env << 'EOF'
NODE_ENV=production
PORT=5000
SESSION_SECRET=your-super-secret-session-key-change-this-in-production
EOF
    log "✅ Arquivo .env criado"
else
    log "✅ Arquivo .env já existe"
fi

# 8. CONFIGURAR PM2
log "🔄 Configurando PM2..."

# Criar diretório de logs
mkdir -p logs

# Parar aplicação se estiver rodando
pm2 delete sistema-atividades 2>/dev/null || true

# Limpar logs antigos
pm2 flush 2>/dev/null || true

# Verificar se build foi criado corretamente
if [ ! -f "dist/index.js" ]; then
    error "Arquivo dist/index.js não encontrado. Verifique se o build foi executado corretamente."
fi

# Iniciar aplicação
pm2 start ecosystem.config.cjs

# Configurar startup automático de forma robusta
startup_cmd=$(pm2 startup | tail -1)
if [[ $startup_cmd == sudo* ]]; then
    log "🔧 Executando comando de startup do PM2..."
    eval "$startup_cmd"
fi
pm2 save

log "✅ PM2 configurado!"

# 9. CONFIGURAR FIREWALL (opcional)
if command -v ufw &> /dev/null; then
    log "🔥 Configurando firewall..."
    ufw allow 8080/tcp
    ufw allow 22/tcp
    ufw allow 80/tcp
    ufw allow 443/tcp
    log "✅ Firewall configurado!"
fi

# 10. VERIFICAR INSTALAÇÃO
log "🧪 Verificando instalação..."

sleep 5  # Aguardar app inicializar

if curl -f http://localhost:5000 > /dev/null 2>&1; then
    log "✅ Aplicação rodando na porta 5000"
else
    error "Aplicação não está respondendo na porta 5000"
fi

if curl -f http://localhost:8080 > /dev/null 2>&1; then
    log "✅ Nginx proxy funcionando na porta 8080"
else
    error "Nginx proxy não está funcionando na porta 8080"
fi

# 11. RESULTADO FINAL
echo ""
echo "🎉 DEPLOY CONCLUÍDO COM SUCESSO!"
echo "================================="
echo ""
echo "🌐 ACESSO: http://$SERVER_IP:8080"
echo "🔐 LOGIN: admin / admin123"
echo ""
echo "📋 COMANDOS ÚTEIS:"
echo "  pm2 status              # Verificar status"
echo "  pm2 logs                # Ver logs"
echo "  pm2 restart all         # Reiniciar app"
echo "  nginx -t                # Testar nginx"
echo "  systemctl reload nginx  # Recarregar nginx"
echo ""
echo "⚠️  IMPORTANTE:"
echo "  - Altere a senha padrão em produção!"
echo "  - Configure backup do banco de dados"
echo "  - Configure SSL se necessário"
echo ""
echo "✅ Sistema pronto para uso!"