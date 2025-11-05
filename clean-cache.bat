@echo off
echo 🧹 Limpando cache e resolvendo problemas de MIME type...

REM Parar processos do Vite se estiverem rodando
echo ⏹️ Parando servidor de desenvolvimento...
taskkill /f /im node.exe 2>nul || echo Nenhum processo Node.js encontrado

REM Limpar cache do npm
echo 🗑️ Limpando cache do npm...
npm cache clean --force

REM Limpar node_modules e reinstalar
echo 📦 Reinstalando dependências...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
npm install

REM Limpar cache do Vite
echo 🧽 Limpando cache do Vite...
if exist .vite rmdir /s /q .vite
if exist dist rmdir /s /q dist

REM Limpar cache do navegador (instruções)
echo 🌐 Para limpar cache do navegador:
echo    - Chrome/Edge: Ctrl+Shift+R ou F12 ^> Network ^> Disable cache
echo    - Firefox: Ctrl+Shift+R ou F12 ^> Network ^> Settings ^> Disable cache
echo    - Safari: Cmd+Option+R ou Develop ^> Empty Caches

echo ✅ Limpeza concluída! Execute 'npm run dev' para iniciar o servidor.
pause


