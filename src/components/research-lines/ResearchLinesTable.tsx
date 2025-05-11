import React from 'react';
import { useRouter } from 'next/navigation';
import { ResearchLine } from '@/types/models/GeneralModels';
import { researchLineService } from '@/services/researchLineService';
import { formatUserFullName, capitalizeFirstLetter } from '../../utils/stringUtils';

interface ResearchLineTableProps {
  programs: ResearchLine[];
}

export default function ResearchLinesTable({ programs }: ResearchLineTableProps) {
  const router = useRouter();

  const handleRowClick = (program: ResearchLine) => {
    const encodedName = encodeURIComponent(program.name);
    router.push(`/lineas/${encodedName}`);
  };

  const handleChangeStatus = async (program: ResearchLine, e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que se active el click de la fila
    
    try {
      await researchLineService.updateStatusResearchLine(program.id);
      window.location.reload();
      
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cambiar el estado');
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-yellow-200">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Nombre</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Coordinador</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Estado</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Cambiar Estado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {programs.map((program, index) => (
            <tr
              key={index}
              onClick={() => handleRowClick(program)}
              className="cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <td className="px-6 py-4 text-sm text-gray-900">
                {capitalizeFirstLetter(program.name)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {formatUserFullName(program.coordinator)}
              </td>
              <td className="px-6 py-4 text-sm">
                <span
                  className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                    program.is_active
                      ? 'bg-green-200 text-green-800'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {program.is_active ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="px-6 py-4 text-sm">
                <button
                  onClick={(e) => handleChangeStatus(program, e)}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    program.is_active
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {program.is_active ? 'Desactivar' : 'Activar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}