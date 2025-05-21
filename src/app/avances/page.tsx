'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import { Progress } from '@/types/models/GeneralModels';
import { progressService } from '@/services/progressesService';
import { toast, Toaster } from 'react-hot-toast';
import SearchBar from '@/components/ui/SearchBar';
import ProgressTable from '@/components/progresses/ProgressTable';
import { checkUserPermission, AVAILABLE_PERMISSIONS } from '@/utils/permissionChecker';

export default function ProgressesPage() {
  const [allProgresses, setAllProgresses] = useState<Progress[]>([]);
  const [filteredProgresses, setFilteredProgresses] = useState<Progress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canCreateProgress, setCanCreateProgress] = useState(false);

  useEffect(() => {
    const loadProgresses = async () => {
      try {
        const allProgresses = await progressService.fetchProgresses(' ');
        setAllProgresses(allProgresses);
        setFilteredProgresses(allProgresses);
        
        // Verificar si el usuario tiene permisos
        const hasCreatePermission = checkUserPermission(AVAILABLE_PERMISSIONS.CREATE);
        setCanCreateProgress(hasCreatePermission);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error al cargar los avances.';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadProgresses();
  }, []);

  return (
    <>
      <Toaster position="top-center" />
      <Header moduleName="Avances" />
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Listado de Avances</h1>
          {canCreateProgress && (
            <Link
              href="/avances/nuevo"
              className="bg-customDarkGreen hover:bg-green-200 text-black font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Agregar Avance
            </Link>
          )}
        </div>
        <div className="mb-6">
          <SearchBar
            onSearch={(query) => {
              if (query.length === 0) {
                setFilteredProgresses(allProgresses);
              } else {
                const filtered = allProgresses.filter(progress =>
                  progress.project.title.toLowerCase().includes(query.toLowerCase())
                );
                setFilteredProgresses(filtered);
              }
            }}
            placeholder="Buscar por nombre del proyecto..."
          />
        </div>

        {error ? (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        ) : isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : filteredProgresses.length > 0 ? (
          <div className="bg-white rounded-lg shadow">
            <ProgressTable progresses={filteredProgresses} />
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No hay avances registrados
          </div>
        )}
      </div>
    </>
  );
}