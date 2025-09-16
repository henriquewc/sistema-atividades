#!/bin/bash

echo "🩺 DIAGNÓSTICO RÁPIDO - PROBLEMA DOS CLIENTES"
echo "============================================"

# Verificar se há erros no PM2
echo "📊 Status e logs do PM2:"
pm2 status
echo ""
pm2 logs sistema-atividades --lines 20

echo ""
echo "🌐 Testando API endpoints:"

# Testar endpoint de clientes
echo "📋 GET /api/clients:"
curl -s http://localhost:5000/api/clients | jq . || curl -s http://localhost:5000/api/clients

echo ""
echo "📋 GET /api/activities:" 
curl -s http://localhost:5000/api/activities | jq . || curl -s http://localhost:5000/api/activities

echo ""
echo "🔧 SOLUÇÕES RÁPIDAS:"
echo "1. Se der erro 500: npm run build && pm2 restart sistema-atividades"
echo "2. Se não mostrar clientes novos: Limpar cache do navegador (Ctrl+Shift+R)"
echo "3. Se persistir: Verificar se o endpoint POST /api/clients funciona"

echo ""
echo "🧪 Teste criar cliente via API:"
echo 'curl -X POST http://localhost:5000/api/clients \'
echo '  -H "Content-Type: application/json" \'
echo '  -d "{"nomeCompleto":"Teste API","documento":"12345678909","endereco":"Rua Teste","celular":"11999999999","numeroContrato":"TEST-001","loginConcessionaria":"teste","senhaConcessionaria":"senha123"}"'