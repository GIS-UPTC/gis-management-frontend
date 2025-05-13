'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import ResearchLineForm from '@/components/research-lines/ResearchLineForm';
import { ResearchLine } from '@/types/models/GeneralModels';
import { researchLineService, ResearchLineServiceError } from '@/services/researchLineService';
import { toast, Toaster } from 'react-hot-toast';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { checkUserPermission, AVAILABLE_PERMISSIONS } from '@/utils/permissionChecker';

export default function NewResearchLinePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [researchLineData, setResearchLineData] = useState<ResearchLine | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    // Verificar permisos del usuario
    const checkPermissions = () => {
      const editResearchLine = searchParams.get('edit');
      const requiredPermission = editResearchLine ? AVAILABLE_PERMISSIONS.EDIT : AVAILABLE_PERMISSIONS.CREATE;
      
      const hasRequiredPermission = checkUserPermission(requiredPermission);
      setHasPermission(hasRequiredPermission);
      
      if (!hasRequiredPermission) {
        toast.error('No tienes permiso para ' + (editResearchLine ? 'editar' : 'crear') + ' líneas de investigación');
        router.push('/lineas');
        return;
      }
      
      if (editResearchLine) {
        setIsEditing(true);
        fetchResearchLineData(editResearchLine);
      }
    };
    
    checkPermissions();
  }, [searchParams, router]);

  const fetchResearchLineData = async (researchLineName: string) => {
    setIsLoading(true);
    try {
      const searchResults = await researchLineService.searchResearchLine(researchLineName);
      if (searchResults.length > 0) {
        setResearchLineData(searchResults[0]);
      } else {
        toast.error('Línea de investigación no encontrada');
      }
    } catch (error) {
      if (error instanceof ResearchLineServiceError) {
        toast.error(error.message);
      } else {
        const errorMessage = 'Ocurrió un error inesperado. Por favor, intente nuevamente.';
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <Header moduleName="Líneas de Investigación" />
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center">
          <Link href="/lineas" className="mr-4">
            <ArrowLeftIcon className="h-8 w-8 text-black hover:text-orange-600" />
          </Link>
          <h1 className="text-2xl font-bold">
            {isEditing ? 'Editar Línea de Investigación' : 'Nueva Línea de Investigación'}
          </h1>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : hasPermission ? (
          <ResearchLineForm initialData={researchLineData} isEditing={isEditing} />
        ) : (
          <div className="text-center py-8 text-red-500">
            No tienes permiso para {isEditing ? 'editar' : 'crear'} líneas de investigación
          </div>
        )}
      </div>
    </>
  );
}