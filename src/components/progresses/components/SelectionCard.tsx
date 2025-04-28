import React from 'react';
import { Project } from '@/types/models/project.models';
import { ResearchLine, User } from '@/types/models/GeneralModels';
import { FaUser, FaProjectDiagram, FaFlask } from 'react-icons/fa';

interface SelectionCardProps {
  item: Project | User | ResearchLine | null;
  type: 'project' | 'researcher' | 'line';
  onClear: () => void;
}

const SelectionCard: React.FC<SelectionCardProps> = ({ item, type, onClear }) => {
  if (!item) return null;

  let icon;
  let title = '';
  let subtitle = '';
  let description = '';

  switch (type) {
    case 'project':
      const project = item as Project;
      icon = <FaProjectDiagram className="text-orange-500 text-xl" />;
      title = project.title || 'Proyecto sin título';
      subtitle = `ID: ${project.id}`;
      description = project.description ? 
        (project.description.length > 100 ? project.description.substring(0, 100) + '...' : project.description) : 
        'Sin descripción';
      break;
    case 'researcher':
      const researcher = item as User;
      icon = <FaUser className="text-orange-500 text-xl" />;
      title = `${researcher.first_name} ${researcher.other_name || ''} ${researcher.surname} ${researcher.other_surname || ''}`.trim();
      subtitle = researcher.email || '';
      description = `ID: ${researcher.id}`;
      break;
    case 'line':
      const line = item as ResearchLine;
      icon = <FaFlask className="text-orange-500 text-xl" />;
      title = line.name || 'Línea sin nombre';
      subtitle = `ID: ${line.id}`;
      break;
  }

  return (
    <div className="mt-2 p-3 border border-gray-200 rounded-lg bg-orange-50">
      <div className="flex justify-between items-start">
        <div className="flex items-start space-x-3">
          <div className="pt-1">{icon}</div>
          <div>
            <h3 className="font-medium text-gray-800">{title}</h3>
            <p className="text-sm text-gray-500">{subtitle}</p>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
        </div>
        <button 
          onClick={onClear}
          className="text-gray-400 hover:text-gray-600 focus:outline-none"
          aria-label="Eliminar selección"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SelectionCard;