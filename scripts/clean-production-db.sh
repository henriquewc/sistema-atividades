#!/bin/bash

# Script para Limpeza do Banco de Dados - Produção
# Remove dados de demonstração e configura ambiente limpo

set -e

echo "🧹 Limpeza do Banco de Dados para Produção"
echo "=========================================="

# Função para log colorido
log() {
    echo -e "\e[32m[$(date '+%H:%M:%S')] $1\e[0m"
}

warning() {
    echo -e "\e[33m[AVISO] $1\e[0m"
}

error() {
    echo -e "\e[31m[ERRO] $1\e[0m"
    exit 1
}

# Verificar se está no diretório do projeto
if [ ! -f "package.json" ]; then
    error "Execute este script na raiz do projeto (onde está o package.json)"
fi

# Confirmar operação
warning "⚠️  ATENÇÃO: Este script irá:"
warning "   - Remover TODOS os dados de demonstração"
warning "   - Remover clientes e atividades de exemplo"
warning "   - Manter apenas estrutura do banco"
echo ""
read -p "Tem certeza que deseja continuar? (digite 'SIM' para confirmar): " confirm

if [ "$confirm" != "SIM" ]; then
    echo "Operação cancelada."
    exit 0
fi

log "🔄 Iniciando limpeza do banco de dados..."

# Backup do estado atual (opcional)
if command -v pm2 &> /dev/null; then
    log "💾 Fazendo backup do estado atual..."
    
    # Criar diretório de backup se não existir
    mkdir -p backups
    
    # Fazer backup dos dados atuais (se usando arquivo de dados)
    if [ -f "data/database.json" ]; then
        cp data/database.json "backups/database-backup-$(date +%Y%m%d-%H%M%S).json"
        log "✅ Backup salvo em backups/"
    fi
fi

# Parar aplicação temporariamente
if command -v pm2 &> /dev/null && pm2 list | grep -q "sistema-atividades"; then
    log "⏸️  Parando aplicação..."
    pm2 stop sistema-atividades
fi

# Aguardar um momento
sleep 2

# OPÇÃO 1: Se usando banco em memória (MemStorage)
log "🗄️  Limpando dados em memória..."

# Criar script Node.js para limpeza
cat > temp-clean-db.js << 'EOF'
const fs = require('fs');
const path = require('path');

console.log('🧹 Limpando dados de demonstração...');

// Se existir arquivo de dados persistente, criar versão limpa
const dataDir = path.join(__dirname, 'data');
const dbFile = path.join(dataDir, 'database.json');

if (fs.existsSync(dbFile)) {
    console.log('📁 Encontrado arquivo de dados, criando versão limpa...');
    
    // Estrutura limpa do banco
    const cleanData = {
        clients: [],
        activities: [],
        attachments: [],
        metadata: {
            created: new Date().toISOString(),
            lastClean: new Date().toISOString(),
            version: '1.0.0'
        }
    };
    
    // Criar backup do arquivo atual
    if (fs.existsSync(dbFile)) {
        const backupFile = dbFile.replace('.json', `-backup-${Date.now()}.json`);
        fs.copyFileSync(dbFile, backupFile);
        console.log(`💾 Backup criado: ${backupFile}`);
    }
    
    // Escrever dados limpos
    fs.writeFileSync(dbFile, JSON.stringify(cleanData, null, 2));
    console.log('✅ Banco de dados limpo!');
} else {
    console.log('ℹ️  Nenhum arquivo de dados encontrado (usando memória)');
    console.log('✅ Dados serão limpos automaticamente no próximo restart');
}

console.log('🎉 Limpeza concluída!');
EOF

# Executar script de limpeza
node temp-clean-db.js

# Remover script temporário
rm -f temp-clean-db.js

# OPÇÃO 2: Se usando PostgreSQL (para futuro)
# Descomente se migrar para PostgreSQL:
#
# log "🐘 Limpando banco PostgreSQL..."
# 
# # Verificar se PostgreSQL está disponível
# if command -v psql &> /dev/null; then
#     # Executar comandos SQL de limpeza
#     psql $DATABASE_URL << 'EOF'
# -- Limpar dados de demonstração
# TRUNCATE TABLE activities CASCADE;
# TRUNCATE TABLE clients CASCADE;
# TRUNCATE TABLE attachments CASCADE;
# 
# -- Resetar sequências
# ALTER SEQUENCE activities_id_seq RESTART WITH 1;
# ALTER SEQUENCE clients_id_seq RESTART WITH 1;
# ALTER SEQUENCE attachments_id_seq RESTART WITH 1;
# 
# -- Inserir apenas admin padrão se necessário
# -- INSERT INTO users (username, password) VALUES ('admin', 'hashed_password');
# 
# EOF
#     log "✅ PostgreSQL limpo!"
# else
#     warning "PostgreSQL não encontrado, pulando limpeza SQL"
# fi

# Limpeza de arquivos temporários
log "🗑️  Removendo arquivos temporários..."

# Remover logs antigos se existirem
if [ -d "logs" ]; then
    find logs -name "*.log" -mtime +30 -delete 2>/dev/null || true
fi

# Remover arquivos de upload temporários
if [ -d "uploads/temp" ]; then
    rm -rf uploads/temp/*
fi

# Limpar cache do npm
npm cache clean --force > /dev/null 2>&1 || true

log "✅ Arquivos temporários removidos!"

# Reconfigurar ambiente de produção
log "⚙️  Configurando ambiente de produção..."

# Verificar/criar arquivo .env para produção
if [ ! -f ".env" ]; then
    cat > .env << 'EOF'
# Configuração de Produção
NODE_ENV=production
PORT=5000

# Segurança - ALTERE ESTAS CHAVES!
SESSION_SECRET=your-super-secret-session-key-change-this-in-production-now

# Database (se usar PostgreSQL no futuro)
# DATABASE_URL=postgresql://user:password@localhost:5432/atividades

# Logs
LOG_LEVEL=info
EOF
    log "✅ Arquivo .env criado - ALTERE AS CHAVES DE SEGURANÇA!"
else
    log "✅ Arquivo .env já existe"
fi

# Reiniciar aplicação
if command -v pm2 &> /dev/null; then
    log "🔄 Reiniciando aplicação..."
    pm2 start sistema-atividades
    
    # Aguardar inicialização
    sleep 5
    
    # Verificar se está funcionando
    if pm2 list | grep -q "sistema-atividades.*online"; then
        log "✅ Aplicação reiniciada com sucesso!"
    else
        error "Falha ao reiniciar aplicação. Verifique os logs: pm2 logs"
    fi
fi

# Verificar se aplicação está respondendo
if curl -f http://localhost:5000 > /dev/null 2>&1; then
    log "✅ Aplicação respondendo na porta 5000"
else
    warning "⚠️  Aplicação pode não estar respondendo. Verifique: curl http://localhost:5000"
fi

echo ""
echo "🎉 LIMPEZA CONCLUÍDA COM SUCESSO!"
echo "================================="
echo ""
echo "✅ Dados de demonstração removidos"
echo "✅ Ambiente configurado para produção"
echo "✅ Aplicação reiniciada"
echo ""
echo "🔐 PRÓXIMOS PASSOS IMPORTANTES:"
echo "  1. Altere as chaves de segurança no arquivo .env"
echo "  2. Altere a senha padrão do admin"
echo "  3. Configure backup automático"
echo "  4. Configure monitoramento"
echo ""
echo "📋 COMANDOS ÚTEIS:"
echo "  pm2 status              # Verificar status"
echo "  pm2 logs                # Ver logs"
echo "  tail -f /var/log/nginx/atividades_*.log  # Logs nginx"
echo ""
echo "✅ Sistema pronto para produção!"