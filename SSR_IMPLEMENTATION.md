# Implementación de Server Side Rendering (SSR) - Grupo de Investigación

## Resumen de Cambios Implementados

Esta documentación describe la implementación completa de Server Side Rendering (SSR) para la aplicación del grupo de investigación, migrando de localStorage a cookies para mejorar el rendimiento y SEO.

## 🚀 Cambios Principales

### 1. **Servicio de Cookies (`src/services/cookieService.ts`)**
- Nuevo servicio para manejar cookies tanto en cliente como servidor
- Funciona con `js-cookie` para compatibilidad universal
- Parseado automático de headers de cookies del servidor
- Manejo seguro de datos del usuario y tokens

### 2. **API Service para SSR (`src/services/apiSSR.ts`)**
- Nueva instancia de API optimizada para SSR
- Interceptores que funcionan con cookies en lugar de localStorage
- Manejo de errores de autenticación en entorno servidor

### 3. **Servicio de Usuarios SSR (`src/services/userServiceSSR.ts`)**
- Versión SSR del servicio de usuarios
- Funciona tanto en cliente como servidor
- Usa cookies para autenticación en llamadas API

### 4. **Servicio de Login SSR (`src/services/loginServiceSSR.ts`)**
- Versión completamente basada en cookies
- Compatible con SSR desde el primer momento

### 5. **Verificador de Permisos SSR (`src/utils/permissionCheckerSSR.ts`)**
- Versión SSR del verificador de permisos
- Funciona con cookies en lugar de localStorage
- Compatible con Server Components

## 🔄 Migración Gradual

### Servicios Actualizados (Híbridos)
Los siguientes servicios fueron actualizados para usar cookies como prioridad y localStorage como fallback:

- **`src/services/loginService.ts`**: Prioriza cookies sobre localStorage
- **`src/services/api.ts`**: Interceptores actualizados para cookies
- **`src/utils/permissionChecker.ts`**: Usa el loginService actualizado
- **`src/hooks/usePermissions.tsx`**: Actualizado para usar cookies
- **`src/components/ProtectedRoute.tsx`**: Migrado a cookies
- **`src/components/layout/Header.tsx`**: Actualizado
- **`src/app/page.tsx`**: Migrado a servicio actualizado
- **`src/app/profile/page.tsx`**: Actualizado

### Página con SSR Completo
- **`src/app/usuarios/page.tsx`**: Convertida a Server Component con SSR
- **`src/components/users/UsersPageClient.tsx`**: Componente cliente separado

## 🛡️ Middleware de Autenticación (`middleware.ts`)

Implementado middleware de Next.js que:
- Verifica autenticación antes de cada request
- Protege rutas automáticamente
- Redirige a login si no está autenticado
- Pasa headers de cookies para SSR

### Rutas Protegidas:
- `/usuarios`
- `/proyectos` 
- `/productos`
- `/lineas`
- `/avances`
- `/reportes`
- `/profile`
- `/roles`

### Rutas Públicas:
- `/auth/login`
- `/publico`
- `/`
- `/api`

## 📦 Dependencias Agregadas

```bash
npm install js-cookie @types/js-cookie
```

## 🎯 Beneficios de la Implementación

### 1. **SEO Mejorado**
- Contenido renderizado en servidor
- Mejor indexación por motores de búsqueda
- Meta tags dinámicos

### 2. **Rendimiento**
- Carga inicial más rápida
- Hidratación optimizada
- Menos JavaScript en el cliente

### 3. **Experiencia de Usuario**
- Navegación más fluida
- Menos tiempos de carga
- Mejor experiencia en conexiones lentas

### 4. **Seguridad**
- Tokens en cookies httpOnly (opcional)
- Verificación de autenticación en servidor
- Protección contra ataques XSS

## 🔧 Configuración

### Variables de Entorno
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NODE_ENV=production # Para cookies seguras
```

### Cookies Configuradas
- `access_token`: Token JWT de autenticación
- `user_data`: Datos del usuario serializados
- Expiración: 7 días
- Secure: Solo en producción
- SameSite: 'lax'

## 📋 Próximos Pasos

### Páginas Pendientes de Conversión a SSR:
1. `/proyectos/page.tsx`
2. `/productos/page.tsx` 
3. `/lineas/page.tsx`
4. `/avances/page.tsx`
5. `/roles/page.tsx`

### Mejoras Futuras:
1. Implementar cookies httpOnly con API routes
2. Agregar revalidación de datos con Next.js
3. Implementar Static Site Generation (SSG) donde sea apropiado
4. Optimizar imágenes con Next.js Image
5. Agregar compresión y caching de datos

## 🧪 Testing

Para probar la implementación:
1. Ejecutar `npm run dev`
2. Navegar a `/usuarios` para ver SSR en acción
3. Verificar que las cookies se establezcan correctamente
4. Probar navegación entre rutas protegidas
5. Verificar redirecciones de autenticación

## 🐛 Debugging

### Problemas Comunes:
1. **Cookies no se establecen**: Verificar configuración de dominio
2. **Redirecciones infinitas**: Revisar middleware y rutas públicas
3. **Hidratación fallida**: Asegurar consistencia servidor-cliente
4. **Permisos no funcionan**: Verificar estructura de datos del usuario

### Logs Útiles:
- Network tab para verificar cookies
- Console para errores de hidratación
- Server logs para errores de SSR 