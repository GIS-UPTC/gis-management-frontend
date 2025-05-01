'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { Progress } from '@/types/models/GeneralModels';
import { progressService } from '@/services/progressesService';
import { toast, Toaster } from 'react-hot-toast';
import { ArrowLeftIcon, LinkIcon, UserIcon, CalendarIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface PageProps {
  params: {
    name: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function ProgressDetailPage({ params }: PageProps) {
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState<Progress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const projectStatus: Record<string, string> = {
    "AC": "Activo",
    "IN": "Inactivo",
    "EJ": "En ejecución",
    "CN": "Cancelado",
    "FN": "Finalizado"
};

  useEffect(() => {
    const fetchProgressDetail = async () => {
      const decodedName = decodeURIComponent(params.name as string);
      const decodedId = searchParams.get('id');

      if (!decodedName || !decodedId) {
        setError('Nombre de avance o ID no ingresados');
        setIsLoading(false);
        return;
      }

      try {
        const progressData = await progressService.searchProgresses(decodedName);
        const foundProgress = progressData.find(u => u.id === Number(decodedId));
        if (!foundProgress) {
          setError('Avance no encontrado');
          setIsLoading(false);
          return;
        }
        setProgress(foundProgress);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error al cargar la información del avance';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgressDetail();
  }, [params.name, searchParams]);

  const progressTypes: Record<string, string> = {
    "PI": "Propuesta Inicial",
    "IO": "Informe Operativo o de Avance",
    "IF": "Informe Financiero",
    "FI": "Informe Final"
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);

    return date.toLocaleString('es-ES', {
      dateStyle: 'short',
      timeStyle: 'short'
    });
  };

  return (
    <>
      <Toaster position="top-center" />
      <Header moduleName="Avances" />
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link href="/avances" className="mr-4">
            <ArrowLeftIcon className="h-8 w-8 text-black hover:text-orange-600" />
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
              <div className="bg-white rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <h3 className="font-bold text-lg">{progress.project.title}</h3>
                  {progress.project.description && (
                    <p className="text-gray-700 mt-2">{progress.project.description}</p>
                  )}
                </div>
                <div className="flex items-center">
                  <div>
                    <p className="text-sm text-gray-500">Estado del proyecto</p>
                    <p className="font-medium">{projectStatus[progress.project.status]}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Información del Usuario */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Usuario que reporta</h2>
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
                    <p className="text-sm text-gray-500">Fecha y hora</p>
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
                    <span>No hay archivo anexado</span>
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