#!/bin/bash

echo "🔧 SCRIPT DE CORREÇÃO - PROBLEMA DOS CLIENTES"
echo "=============================================="

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Execute este script no diretório raiz do projeto!"
    exit 1
fi

echo "📍 Verificando logs do PM2..."
pm2 logs sistema-atividades --lines 20

echo ""
echo "🔍 DIAGNÓSTICO: Verificando erros TypeScript..."

# 1. Verificar status do PM2
echo "📊 Status PM2:"
pm2 status

echo ""
echo "🛠️  APLICANDO CORREÇÕES..."

# 2. Backup do arquivo atual
echo "💾 Fazendo backup do storage.ts..."
cp server/storage.ts server/storage.ts.backup

# 3. Aplicar correção nos tipos TypeScript
echo "🔧 Corrigindo tipos no storage.ts..."

# Corrigir createProposta method
sed -i '/async createProposta(insertProposta: InsertProposta): Promise<Proposta> {/,/return proposta;/c\
  async createProposta(insertProposta: InsertProposta): Promise<Proposta> {\
    const id = randomUUID();\
    const proposta: Proposta = {\
      ...insertProposta,\
      id,\
      status: "rascunho",\
      enderecoCliente: insertProposta.enderecoCliente ?? null,\
      valorFinalPersonalizado: insertProposta.valorFinalPersonalizado ?? null,\
      margemRealObtida: insertProposta.margemRealObtida ?? null,\
      valorPorWp: insertProposta.valorPorWp ?? null,\
      dataVistoria: insertProposta.dataVistoria ?? null,\
      observacoesTecnicas: insertProposta.observacoesTecnicas ?? null,\
      createdAt: new Date(),\
    };\
    this.propostas.set(id, proposta);\
    return proposta;\
  }' server/storage.ts

# Corrigir configuração method
sed -i '/const config: Configuracao = {/,/updatedAt: new Date(),/c\
      const config: Configuracao = {\
        ...insertConfig,\
        id,\
        descricao: insertConfig.descricao ?? null,\
        updatedAt: new Date(),\
      };' server/storage.ts

echo "✅ Correções aplicadas!"

# 4. Verificar se há erros de compilação
echo "🔍 Verificando compilação TypeScript..."
npx tsc --noEmit || echo "⚠️  Existem erros de TypeScript"

# 5. Rebuild do projeto
echo "🔨 Fazendo rebuild..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build realizado com sucesso!"
    
    # 6. Reiniciar aplicação
    echo "🔄 Reiniciando aplicação..."
    pm2 restart sistema-atividades
    
    # 7. Aguardar inicialização
    echo "⏳ Aguardando inicialização..."
    sleep 5
    
    # 8. Verificar se a aplicação está rodando
    echo "🩺 Verificando saúde da aplicação..."
    
    # Testar endpoint de clientes
    echo "📋 Testando endpoint /api/clients..."
    curl -s http://localhost:5000/api/clients | head -100
    
    echo ""
    echo "📋 Testando endpoint /api/activities..."
    curl -s http://localhost:5000/api/activities | head -100
    
    echo ""
    echo "✅ CORREÇÃO FINALIZADA!"
    echo "🌐 Acesse: http://seu-ip:8080"
    echo ""
    echo "📝 PRÓXIMOS PASSOS:"
    echo "1. Acesse o sistema no navegador"
    echo "2. Tente cadastrar um novo cliente"
    echo "3. Verifique se ele aparece na listagem"
    echo "4. Teste criar uma atividade e vincular ao cliente"
    
else
    echo "❌ Erro no build! Restaurando backup..."
    cp server/storage.ts.backup server/storage.ts
    echo "🔄 Reiniciando com versão anterior..."
    pm2 restart sistema-atividades
fi

echo ""
echo "📊 Logs em tempo real (Ctrl+C para sair):"
pm2 logs sistema-atividades --follow