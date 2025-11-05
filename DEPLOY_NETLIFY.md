# Guia de Deploy no Netlify - Projeto Geco

## 🚀 Deploy Manual (Arrastar e Soltar)

### 1. Preparação
- ✅ Build já foi criado (`npm run build`)
- ✅ Pasta `dist` contém os arquivos de produção
- ✅ Arquivo `netlify.toml` configurado

### 2. Upload no Netlify
1. Acesse [netlify.com](https://netlify.com)
2. Faça login na sua conta
3. Na dashboard, vá para **"Sites"**
4. Arraste a pasta `dist` para a área de deploy
5. Aguarde o upload e deploy automático

### 3. Configuração do Site
- **Site Name**: Escolha um nome único (ex: `geco-orcamentos`)
- **Custom Domain**: Opcional, pode configurar depois
- **HTTPS**: Ativado automaticamente

## 🔗 Deploy via Git (Recomendado)

### 1. Preparar Repositório
```bash
# Inicializar git (se não existir)
git init

# Adicionar arquivos
git add .

# Commit inicial
git commit -m "Initial commit - Geco project"

# Conectar ao GitHub/GitLab
git remote add origin https://github.com/seu-usuario/geco.git
git push -u origin main
```

### 2. Deploy Automático
1. No Netlify, clique em **"New site from Git"**
2. Conecte sua conta GitHub/GitLab
3. Selecione o repositório `geco`
4. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: `18` (ou superior)

### 3. Deploy Contínuo
- ✅ Cada push no repositório gera um novo deploy
- ✅ Preview de branches automaticamente
- ✅ Rollback fácil para versões anteriores

## ⚙️ Configurações Importantes

### Variáveis de Ambiente (se necessário)
No Netlify Dashboard > Site Settings > Environment Variables:
```
NODE_VERSION=18
NPM_VERSION=9
```

### Domínio Personalizado
1. Site Settings > Domain Management
2. Add custom domain
3. Configure DNS conforme instruções
4. SSL automático via Let's Encrypt

### Formulários (se usar)
- Netlify Forms funciona automaticamente
- Não precisa de backend para formulários simples

## 📊 Monitoramento

### Analytics
- Netlify Analytics (pago)
- Google Analytics (gratuito)
- Hotjar (opcional)

### Performance
- Lighthouse scores automáticos
- Core Web Vitals
- CDN global incluído

## 🔧 Troubleshooting

### Build Failures
- Verificar `package.json` scripts
- Verificar dependências
- Verificar Node.js version

### Routing Issues
- Arquivo `netlify.toml` já configurado
- Redirects para SPA funcionando

### MIME Type Issues
- Headers já configurados no `netlify.toml`
- JavaScript servido corretamente

## 🎯 Próximos Passos

1. **Deploy**: Escolher método (manual ou Git)
2. **Teste**: Verificar funcionamento no domínio Netlify
3. **Domínio**: Configurar domínio personalizado
4. **Analytics**: Adicionar Google Analytics
5. **SEO**: Configurar meta tags
6. **PWA**: Considerar Progressive Web App

## 📱 URLs de Acesso

Após o deploy, seu site estará disponível em:
- **Netlify URL**: `https://seu-site-name.netlify.app`
- **Custom Domain**: `https://seu-dominio.com` (se configurado)

## ✅ Checklist Final

- [ ] Build executado com sucesso
- [ ] Arquivo `netlify.toml` criado
- [ ] Deploy realizado
- [ ] Site funcionando
- [ ] Domínio configurado (opcional)
- [ ] Analytics configurado (opcional)
- [ ] SSL ativo
- [ ] Performance verificada


