# Configuração adicional para resolver problemas de MIME type
# Adicione estas configurações ao seu servidor web se necessário

# Para Apache (.htaccess)
<IfModule mod_mime.c>
    # Garantir MIME types corretos para JavaScript
    AddType application/javascript .js
    AddType application/javascript .jsx
    AddType application/javascript .mjs
    AddType text/javascript .js
    AddType text/javascript .jsx
    AddType text/javascript .mjs
    
    # Para arquivos de módulo ES6
    AddType application/javascript .js
    AddType application/javascript .jsx
</IfModule>

# Para Nginx (nginx.conf)
# location ~* \.(js|jsx|mjs)$ {
#     add_header Content-Type application/javascript;
#     expires 1y;
#     add_header Cache-Control "public, immutable";
# }

# Para IIS (web.config)
# <configuration>
#   <system.webServer>
#     <staticContent>
#       <mimeMap fileExtension=".js" mimeType="application/javascript" />
#       <mimeMap fileExtension=".jsx" mimeType="application/javascript" />
#       <mimeMap fileExtension=".mjs" mimeType="application/javascript" />
#     </staticContent>
#   </system.webServer>
# </configuration>


