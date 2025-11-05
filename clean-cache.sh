#!/bin/bash

# Script para limpar cache e resolver problemas de MIME type
echo "🧹 Limpando cache e resolvendo problemas de MIME type..."

# Parar processos do Vite se estiverem rodando
echo "⏹️ Parando servidor de desenvolvimento..."
pkill -f "vite" || true

# Limpar cache do npm
echo "🗑️ Limpando cache do npm..."
npm cache clean --force

# Limpar node_modules e reinstalar
echo "📦 Reinstalando dependências..."
rm -rf node_modules
rm -f package-lock.json
npm install

# Limpar cache do Vite
echo "🧽 Limpando cache do Vite..."
rm -rf .vite
rm -rf dist

# Limpar cache do navegador (instruções)
echo "🌐 Para limpar cache do navegador:"
echo "   - Chrome/Edge: Ctrl+Shift+R ou F12 > Network > Disable cache"
echo "   - Firefox: Ctrl+Shift+R ou F12 > Network > Settings > Disable cache"
echo "   - Safari: Cmd+Option+R ou Develop > Empty Caches"

echo "✅ Limpeza concluída! Execute 'npm run dev' para iniciar o servidor."


