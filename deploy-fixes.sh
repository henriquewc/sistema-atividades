#!/bin/bash

echo "🚀 Iniciando deploy das correções..."

# Navegar para o diretório do projeto
cd /home/ubuntu/sistema-atividades

# Fazer backup da pasta atual (caso precise reverter)
echo "📦 Fazendo backup..."
cp -r . ../sistema-atividades-backup-$(date +%Y%m%d_%H%M%S)

# Fazer pull das últimas mudanças
echo "📥 Baixando correções do GitHub..."
git pull origin main

# Instalar/atualizar dependências
echo "📚 Instalando dependências..."
npm install

# Reiniciar aplicação com PM2
echo "🔄 Reiniciando aplicação..."
pm2 restart all

# Verificar status
echo "✅ Verificando status..."
pm2 status

echo ""
echo "🎉 Deploy concluído!"
echo "💻 Acesse: http://82.25.75.49:8080"
echo "🔑 Login: admin / admin123"
echo ""
echo "Para verificar logs em tempo real:"
echo "pm2 logs"