'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import { Progress } from '@/types/models/GeneralModels';
import { progressService } from '@/services/progressesService';
import { toast } from 'react-hot-toast';
import SearchBar from '@/components/ui/SearchBar';
import ProgressTable from '@/components/progresses/ProgressTable';

export default function ProgressesPage() {
  const [progresses, setProgresses] = useState<Progress[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 3) {
      setProgresses([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const results = await progressService.searchProgresses(query);
      setProgresses(results);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error al buscar los avances.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header moduleName="Avances" />
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Listado de Avances</h1>
          <Link
            href="/avances/nuevo"
            className="bg-customDarkGreen hover:bg-green-200 text-black font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Agregar Avance...
          </Link>
        </div>

        <div className="mb-6">
          <div className="flex gap-2">
            <div className="flex-grow">
              <SearchBar 
                onSearch={handleSearch} 
                isLoading={isLoading} 
                placeholder="Buscar avances (ingrese el nombre del proyecto)..."
              />
            </div>
          </div>
          {searchQuery.length > 0 && searchQuery.length < 3 && (
            <p className="text-sm text-orange-600 mt-1">Ingrese al menos 3 caracteres para buscar</p>
          )}
        </div>

        {error ? (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        ) : isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : progresses.length > 0 ? (
          <div className="bg-white rounded-lg shadow">
            <ProgressTable progresses={progresses} />
          </div>
        ) : searchQuery.length >= 3 ? (
          <div className="text-center py-8 text-gray-500">
            No se encontraron avances que coincidan con la búsqueda
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Utilice el buscador para encontrar avances
          </div>
        )}
      </div>
    </>
  );
}