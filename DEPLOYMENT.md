# 🚀 Deployment en Dokploy - Centro Atención Municipal

## 📋 Requisitos Previos

- Cuenta en Dokploy
- Repositorio Git con el código
- Variables de entorno configuradas

## 🔧 Configuración en Dokploy

### 1. Crear Nueva Aplicación

1. Ir a Dokploy Dashboard
2. Click en "New Application"
3. Seleccionar "Docker" como tipo de deployment

### 2. Configurar Repositorio

- **Repository URL**: Tu URL de Git
- **Branch**: `main` o tu rama principal
- **Build Context**: `/centroatencionmunicipal`
- **Dockerfile Path**: `./Dockerfile`

### 3. Variables de Entorno

Agregar las siguientes variables en Dokploy:

```env
NEXT_PUBLIC_API_URL=https://tu-api-backend.com/api
NODE_ENV=production
```

### 4. Configuración de Puerto

- **Container Port**: `8080`
- **Exposed Port**: `80` o `443` (según tu configuración)

### 5. Build Settings

- **Build Command**: Automático (usa Dockerfile)
- **Start Command**: Automático (usa CMD del Dockerfile)

## 🐳 Build Local (Opcional)

Para probar el build localmente antes de deployar:

```bash
# Construir la imagen
docker build -t centro-atencion-municipal .

# Ejecutar el contenedor
docker run -p 8080:8080 \
  -e NEXT_PUBLIC_API_URL=http://localhost:8080/api \
  centro-atencion-municipal
```

## 📦 Proceso de Build

El Dockerfile ejecuta los siguientes pasos:

1. **Instalar dependencias** - `npm ci`
2. **Build de Next.js** - `npm run build`
3. **Crear imagen optimizada** - Standalone output
4. **Exponer puerto 8080**
5. **Iniciar servidor** - `node server.js`

## 🔄 Deploy Automático

Dokploy detectará cambios en tu repositorio y hará deploy automático cuando:

- Hagas push a la rama configurada
- Actives el webhook de GitHub/GitLab

## ✅ Verificación

Después del deploy, verifica:

1. **Health Check**: `https://tu-dominio.com`
2. **API Connection**: Verifica que se conecte al backend
3. **Login**: Prueba el sistema de autenticación

## 🐛 Troubleshooting

### Error: Cannot find module 'next'
- Asegúrate que `output: 'standalone'` esté en `next.config.mjs`

### Error: Port already in use
- Verifica que el puerto 8080 esté disponible en Dokploy

### Error: API connection failed
- Verifica la variable `NEXT_PUBLIC_API_URL`
- Asegúrate que el backend esté accesible

## 📊 Recursos

- **CPU**: Mínimo 1 core
- **RAM**: Mínimo 512MB (recomendado 1GB)
- **Storage**: ~200MB para la imagen

## 🔐 Seguridad

- Usa HTTPS en producción
- Configura CORS en el backend
- Usa variables de entorno para secrets
- No commitees `.env.local` al repositorio