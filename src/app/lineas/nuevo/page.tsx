'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import ResearchLineForm from '@/components/research-lines/ResearchLineForm';
import { ResearchLine } from '@/types/models/GeneralModels';
import { researchLineService, ResearchLineServiceError } from '@/services/researchLineService';
import { toast } from 'react-hot-toast';

export default function NewResearchLinePage() {
  const searchParams = useSearchParams();
  const [isEditing, setIsEditing] = useState(false);
  const [withInactives, setWithInactives] = useState(false);
  const [researchLineData, setResearchLineData] = useState<ResearchLine | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const editResearchLine = searchParams.get('edit');
    if (editResearchLine) {
      setIsEditing(true);
      fetchResearchLineData(editResearchLine);
    }
  }, [searchParams]);

  const handleWithInactivesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWithInactives(e.target.checked);
  };

  const fetchResearchLineData = async (researchLineName: string) => {
    setIsLoading(true);
    try {
      const searchResults = await researchLineService.searchResearchLine(researchLineName, withInactives);
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
      <Header moduleName="Gestión de Líneas de Investigación" />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            {isEditing ? 'Editar Línea de Investigación' : 'Nueva Línea de Investigación'}
          </h1>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <ResearchLineForm initialData={researchLineData} isEditing={isEditing} withInactives={withInactives} handleWithInactivesChange={handleWithInactivesChange} />
        )}
      </div>
    </>
  );
}