#!/bin/bash

echo "🚀 Iniciando deploy do Sistema de Atividades..."

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script na raiz do projeto (onde está o package.json)"
    exit 1
fi

# Instalar dependências
echo "📦 Instalando dependências..."
npm ci --production=false

# Build da aplicação
echo "🔨 Fazendo build da aplicação..."
npm run build

# Verificar se o build foi criado
if [ ! -d "dist" ]; then
    echo "❌ Erro: Build falhou - diretório dist não foi criado"
    exit 1
fi

echo "✅ Build concluído com sucesso!"

# Se PM2 estiver instalado, reiniciar a aplicação
if command -v pm2 &> /dev/null; then
    echo "🔄 Reiniciando aplicação com PM2..."
    pm2 reload ecosystem.config.cjs
    pm2 save
    echo "✅ Aplicação reiniciada!"
else
    echo "⚠️  PM2 não encontrado. Instale com: npm install -g pm2"
fi

echo "🎉 Deploy concluído!"