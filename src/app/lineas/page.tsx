'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import { ResearchLine } from '@/types/models/GeneralModels';
import { researchLineService, ResearchLineServiceError } from '@/services/researchLineService';
import SearchBar from '@/components/ui/SearchBar';
import { toast, Toaster } from 'react-hot-toast';
import ResearchLinesTable from '@/components/research-lines/ResearchLinesTable';

export default function ResearchLinesPage() {
  const [allLines, setAllLines] = useState<ResearchLine[]>([]);
  const [filteredLines, setFilteredLines] = useState<ResearchLine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadResearchLines = async () => {
      try {
        const allLines = await researchLineService.fetchResearchLines(' ');
        setAllLines(allLines);
        setFilteredLines(allLines);
      } catch (error) {
        if (error instanceof ResearchLineServiceError) {
          setError(error.message);
          toast.error(error.message);
        } else {
          const errorMessage = 'Ocurrió un error al cargar las líneas de investigación. Por favor, intente nuevamente.';
          setError(errorMessage);
          toast.error(errorMessage);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadResearchLines();
  }, []);

  return (
    <>
    <Toaster position="top-center" />
      <Header moduleName="Líneas de Investigación" />
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Listado de Líneas de Investigación</h1>
          <Link
            href="/lineas/nuevo"
            className="bg-customDarkGreen hover:bg-green-200 text-black font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Agregar Línea de Investigación
          </Link>
        </div>
        <div className="mb-6">
          <SearchBar
            onSearch={(query) => {
              if (query.length === 0) {
                setFilteredLines(allLines);
              } else {
                const filtered = allLines.filter(line =>
                  line.name.toLowerCase().includes(query.toLowerCase())
                );
                setFilteredLines(filtered);
              }
            }}
            placeholder="Buscar línea de investigación..."
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
        ) : filteredLines.length > 0 ? (
          <div className="bg-white rounded-lg shadow">
            <ResearchLinesTable programs={filteredLines} />
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No hay líneas de investigación registradas
          </div>
        )}
      </div>
    </>
  );
}