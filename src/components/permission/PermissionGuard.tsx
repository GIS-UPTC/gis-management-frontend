import React, { ReactNode } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { useRouter } from 'next/navigation';

interface PermissionGuardProps {
  accessName: string;
  permissionName: string;
  children: ReactNode;
  fallback?: ReactNode;
  redirectOnDenied?: string;
}

export function PermissionGuard({
  accessName,
  permissionName,
  children,
  fallback = null,
  redirectOnDenied
}: PermissionGuardProps) {
  const { hasPermission } = usePermissions();
  const router = useRouter();
  
  // Verificamos el permiso en cada renderizado para tener la información más actualizada
  const hasAccess = hasPermission(accessName, permissionName);
  
  // Agregamos logs para depuración
  React.useEffect(() => {
    console.log(`Verificando permiso: ${permissionName} para acceso: ${accessName}. Resultado: ${hasAccess}`);
  }, [accessName, permissionName, hasAccess]);
  
  // Si no tiene permiso y hay una ruta de redirecciu00f3n, redirigir
  React.useEffect(() => {
    if (!hasAccess && redirectOnDenied) {
      console.log(`Redirigiendo a ${redirectOnDenied} por falta de permiso ${permissionName} para ${accessName}`);
      router.push(redirectOnDenied);
    }
  }, [hasAccess, redirectOnDenied, router, accessName, permissionName]);
  
  // Si tiene permiso, mostrar los hijos, de lo contrario mostrar el fallback
  return hasAccess ? <>{children}</> : <>{fallback}</>;
}

// Componentes especu00edficos para cada tipo de permiso
export function CreateGuard({ accessName, children, fallback, redirectOnDenied }: Omit<PermissionGuardProps, 'permissionName'>) {
  console.log(`Renderizando CreateGuard para acceso: ${accessName}`);
  return (
    <PermissionGuard
      accessName={accessName}
      permissionName="crear"
      fallback={fallback}
      redirectOnDenied={redirectOnDenied}
    >
      {children}
    </PermissionGuard>
  );
}

export function EditGuard({ accessName, children, fallback, redirectOnDenied }: Omit<PermissionGuardProps, 'permissionName'>) {
  return (
    <PermissionGuard
      accessName={accessName}
      permissionName="editar"
      fallback={fallback}
      redirectOnDenied={redirectOnDenied}
    >
      {children}
    </PermissionGuard>
  );
}

export function DeleteGuard({ accessName, children, fallback, redirectOnDenied }: Omit<PermissionGuardProps, 'permissionName'>) {
  return (
    <PermissionGuard
      accessName={accessName}
      permissionName="eliminar"
      fallback={fallback}
      redirectOnDenied={redirectOnDenied}
    >
      {children}
    </PermissionGuard>
  );
}

export function ViewGuard({ accessName, children, fallback, redirectOnDenied }: Omit<PermissionGuardProps, 'permissionName'>) {
  return (
    <PermissionGuard
      accessName={accessName}
      permissionName="ver"
      fallback={fallback}
      redirectOnDenied={redirectOnDenied}
    >
      {children}
    </PermissionGuard>
  );
}

export function ChangeActivationGuard({ accessName, children, fallback, redirectOnDenied }: Omit<PermissionGuardProps, 'permissionName'>) {
  return (
    <PermissionGuard
      accessName={accessName}
      permissionName="cambiar activacion"
      fallback={fallback}
      redirectOnDenied={redirectOnDenied}
    >
      {children}
    </PermissionGuard>
  );
}

export function GenerateReportGuard({ accessName, children, fallback, redirectOnDenied }: Omit<PermissionGuardProps, 'permissionName'>) {
  return (
    <PermissionGuard
      accessName={accessName}
      permissionName="generar reporte"
      fallback={fallback}
      redirectOnDenied={redirectOnDenied}
    >
      {children}
    </PermissionGuard>
  );
}

export function ChangeStatusGuard({ accessName, children, fallback, redirectOnDenied }: Omit<PermissionGuardProps, 'permissionName'>) {
  return (
    <PermissionGuard
      accessName={accessName}
      permissionName="cambiar estado"
      fallback={fallback}
      redirectOnDenied={redirectOnDenied}
    >
      {children}
    </PermissionGuard>
  );
}
