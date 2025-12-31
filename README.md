# GIS - Grupo de Investigación

Sistema de gestión para grupos de investigación desarrollado con Next.js 15, diseñado para ofrecer alto rendimiento mediante Server Side Rendering (SSR) y una experiencia de usuario fluida.

## 🚀 Tecnologías

Este proyecto utiliza un stack moderno de tecnologías:
-   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
-   **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
-   **Estilos**: [Tailwind CSS](https://tailwindcss.com/)
-   **Autenticación**: Custom, basada en Cookies (ver `SSR_IMPLEMENTATION.md`)
-   **Iconos**: Lucide React, React Icons, Heroicons
-   **Utilidades**: Axios, React Hot Toast, XLSX

## ✨ Características Principales

-   **Server Side Rendering (SSR)**: Optimización de carga inicial y SEO mediante renderizado en servidor.
-   **Gestión de Sesiones Segura**: Implementación de autenticación basada en cookies HTTP (o compatibles con SSR) en lugar de localStorage.
-   **Rutas Protegidas**: Middleware para protección de rutas como `/usuarios`, `/proyectos`, `/profile`, etc.
-   **Gestión Integral**: Módulos para administración de usuarios, proyectos de investigación, productos, líneas de investigación y avances.
-   **Exportación de Datos**: Funcionalidad para exportar datos a Excel.

## 🛠️ Instalación y Configuración

### Prerrequisitos
-   Node.js (versión recomendada LTS, v18+ o v20+)
-   npm

### Pasos

1.  **Clonar el repositorio**:
    ```bash
    git clone <url-del-repositorio>
    cd gis-management-frontend
    ```

2.  **Instalar dependencias**:
    ```bash
    npm install
    ```

3.  **Variables de Entorno**:
    Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables (ajusta según tu entorno):
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
    NODE_ENV=development
    ```

4.  **Ejecutar en desarrollo**:
    ```bash
    npm run dev
    ```
    La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

5.  **Construir para producción**:
    ```bash
    npm run build
    npm start
    ```

## 📂 Estructura del Proyecto

```
src/
├── app/              # Páginas y rutas (App Router)
├── components/       # Componentes reutilizables de UI
├── services/         # Servicios para comunicación con API (Axios)
│   ├── apiSSR.ts     # Cliente API optimizado para SSR
│   └── ...
├── hooks/            # Custom Hooks
├── utils/            # Utilidades y helpers
├── types/            # Definiciones de tipos TypeScript
└── middleware.ts     # Middleware de autenticación y protección de rutas
```

## 📄 Documentación Adicional

Para más detalles sobre la implementación técnica del SSR y la gestión de cookies, consulta el archivo [SSR_IMPLEMENTATION.md](./SSR_IMPLEMENTATION.md).
