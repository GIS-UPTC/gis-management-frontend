'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { Progress } from '@/types/models/GeneralModels';
import { progressService } from '@/services/progressesService';
import { toast } from 'react-hot-toast';
import { ArrowLeftIcon, DocumentIcon, LinkIcon, UserIcon, CalendarIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface ProgressDetailPageProps {
  params: {
    name: string;
  };
}

export default function ProgressDetailPage({ params }: ProgressDetailPageProps) {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Decode the name parameter
  const decodedName = decodeURIComponent(params.name);

  useEffect(() => {
    const fetchProgressDetail = async () => {
      if (!decodedName) {
        setError('Nombre de avance no válido');
        setIsLoading(false);
        return;
      }

      try {
        const progressData = await progressService.searchProgresses(decodedName);
        setProgress(progressData[0]);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error al cargar la información del avance';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgressDetail();
  }, [decodedName]);

  const progressTypes: Record<string, string> = {
    "PI": "Progreso Inicial",
    "IO": "Otro Intermedio",
    "IF": "Informe Final",
    "FI": "Final"
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No especificada';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <Header moduleName="Gestión de Avances" />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6 flex items-center">
          <Link href="/progresses" className="mr-4">
            <ArrowLeftIcon className="h-5 w-5 text-gray-600 hover:text-orange-600" />
          </Link>
          <h1 className="text-2xl font-bold">Detalle del Avance</h1>
        </div>

        {error ? (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        ) : isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : progress ? (
          <div className="bg-customLightYellow rounded-lg shadow p-6">
            {/* Detalles del Proyecto */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Información del Proyecto</h2>
              <div className="bg-white rounded-lg p-4">
                <h3 className="font-bold text-lg">{progress.project.title}</h3>
                {progress.project.description && (
                  <p className="text-gray-700 mt-2">{progress.project.description}</p>
                )}
              </div>
            </div>

            {/* Información del Usuario */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Usuario</h2>
              <div className="bg-white rounded-lg p-4 flex items-center">
                <UserIcon className="h-10 w-10 text-orange-500 mr-3" />
                <div>
                  <p className="font-semibold">
                    {progress.user.first_name} {progress.user.other_name || ''} {progress.user.surname} {progress.user.other_surname || ''}
                  </p>
                  {progress.user.email && (
                    <p className="text-gray-600">{progress.user.email}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Detalles del Avance */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Información del Avance</h2>
              <div className="bg-white rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <div className="bg-orange-100 p-2 rounded-full mr-3">
                    <DocumentTextIcon className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tipo de avance</p>
                    <p className="font-medium">{progressTypes[progress.type] || progress.type}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="bg-orange-100 p-2 rounded-full mr-3">
                    <CalendarIcon className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Fecha</p>
                    <p className="font-medium">{formatDate(progress.date)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Documento o Enlace */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Documentación</h2>
              <div className="bg-white rounded-lg p-4">
                {progress.document_link ? (
                  <div className="flex items-center">
                    <LinkIcon className="h-6 w-6 text-blue-600 mr-2" />
                    <a 
                      href={progress.document_link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:underline break-all"
                    >
                      {progress.document_link}
                    </a>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <DocumentIcon className="h-6 w-6 text-green-600 mr-2" />
                    <span>Archivo adjunto al sistema</span>
                  </div>
                )}
              </div>
            </div>

            {/* Descripción */}
            {progress.description && (
              <div>
                <h2 className="text-xl font-semibold mb-3">Descripción</h2>
                <div className="bg-white rounded-lg p-4">
                  <p className="whitespace-pre-line">{progress.description}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No se encontró información del avance
          </div>
        )}
      </div>
    </>
  );
}