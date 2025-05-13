'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import ProgressForm from '@/components/progresses/ProgressForm';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';
import { checkUserPermission, AVAILABLE_PERMISSIONS } from '@/utils/permissionChecker';

export default function NewProgressPage() {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar permisos del usuario
    const checkPermissions = () => {
      const hasCreatePermission = checkUserPermission(AVAILABLE_PERMISSIONS.CREATE);
      setHasPermission(hasCreatePermission);
      
      if (!hasCreatePermission) {
        toast.error('No tienes permiso para crear avances');
        router.push('/avances');
      }
      
      setIsLoading(false);
    };
    
    checkPermissions();
  }, [router]);

  return (
    <>
      <Toaster position="top-center" />
      <Header moduleName="Avances" />
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center">
          <Link href="/avances" className="mr-4">
            <ArrowLeftIcon className="h-8 w-8 text-black hover:text-orange-600" />
          </Link>
          <h1 className="text-2xl font-bold">Nuevo Avance</h1>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : hasPermission ? (
          <ProgressForm />
        ) : (
          <div className="text-center py-8 text-red-500">
            No tienes permiso para crear avances
          </div>
        )}
      </div>
    </>
  );
}