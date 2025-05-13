'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import { ResearchLine } from '@/types/models/GeneralModels';
import { researchLineService, ResearchLineServiceError } from '@/services/researchLineService';
import { toast, Toaster } from 'react-hot-toast';
import Link from 'next/link';
import ArrowLeftIcon from '@heroicons/react/24/outline/ArrowLeftIcon';
import { capitalizeFirstLetter, formatUserFullName } from '@/utils/stringUtils';
import { checkUserPermission, AVAILABLE_PERMISSIONS } from '@/utils/permissionChecker';

export default function ResearchLineDetailsPage() {
  const params = useParams();
  const [researchLine, setResearchLine] = useState<ResearchLine | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [canEditLine, setCanEditLine] = useState(false);

  useEffect(() => {
    const fetchResearchLine = async () => {
      try {
        const lineName = decodeURIComponent(params.name as string);
        const searchResults = await researchLineService.searchResearchLine(lineName);

        if (searchResults.length === 0) {
          toast.error('Línea de investigación no encontrada');
          return;
        }

        setResearchLine(searchResults[0]);
        
        // Verificar si el usuario tiene permiso para editar líneas de investigación
        const hasEditPermission = checkUserPermission(AVAILABLE_PERMISSIONS.EDIT);
        setCanEditLine(hasEditPermission);

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

    fetchResearchLine();
  }, [params.name]);

  if (isLoading) {
    return (
      <>
        <Header moduleName="Líneas de Investigación" />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </>
    );
  }

  if (!researchLine) {
    return (
      <>
        <Header moduleName="Líneas de Investigación" />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-8 text-gray-500">
            Línea de investigación no encontrada
          </div>
        </div>
      </>
    );
  }

  return (
    <>
    <Toaster position="top-center" />
      <Header moduleName="Líneas de Investigación" />
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <Link href="/lineas" className="mr-4">
            <ArrowLeftIcon className="h-8 w-8 text-black hover:text-orange-600" />
          </Link>
          <h1 className="text-2xl font-bold">Detalles de la Línea de Investigación</h1>
          {canEditLine && (
            <button
              onClick={() => window.location.href = `/lineas/nuevo?edit=${encodeURIComponent(researchLine.name)}`}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Editar Línea
            </button>
          )}
        </div>
  
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Información básica de la línea */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Información General</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre de la Línea</label>
                  <p className="mt-1">{capitalizeFirstLetter(researchLine.name)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Estado</label>
                  <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full mt-1 ${
                    researchLine.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'
                  }`}>
                    {researchLine.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Coordinador</label>
                  <p className="mt-1">
                    {formatUserFullName(researchLine.coordinator)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 