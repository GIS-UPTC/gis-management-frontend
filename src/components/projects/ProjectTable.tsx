import React from 'react';
import { useRouter } from 'next/navigation';
import { Project } from '@/types/models/project.models';
import { capitalizeFirstLetter } from '@/utils/stringUtils';
import ProjectStatusChanger from './ProjectStatusChanger';
import { Toaster } from 'react-hot-toast';


interface ProjectTableProps {
  projects: Project[];
  onStatusChange?: () => void;
}

export default function ProjectTable({ projects, onStatusChange }: ProjectTableProps) {
  const router = useRouter();

  const handleRowClick = (project: Project) => {
    router.push(`/proyectos/${project.title}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="overflow-x-auto">
      <Toaster position="top-center" />
      <table className="min-w-full bg-white">
        <thead className="bg-yellow-200">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Título</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Código</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Fecha Creación</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Duración (días)</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Financiado</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Estado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {projects.map((project) => (
            <tr
              key={project.id}
              onClick={() => handleRowClick(project)}
              className="cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <td className="px-6 py-4 text-sm text-gray-900">{capitalizeFirstLetter(project.title)}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{project.code}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{formatDate(project.creation_date)}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{project.duration_days}</td>
              <td className="px-6 py-4 text-sm">
                <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                  project.has_financing ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                }`}>
                  {project.has_financing ? 'Sí' : 'No'}
                </span>
              </td>
              <td className="px-6 py-4 text-sm">
                <ProjectStatusChanger 
                  projectId={project.id} 
                  currentStatus={project.status} 
                  onStatusChange={onStatusChange}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}