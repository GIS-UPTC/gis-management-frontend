import React from 'react';
import { Project } from '@/types/models/project.models';

interface ProjectStatsProps {
  projects: Project[];
}

export default function ProjectStats({ projects }: ProjectStatsProps) {
  const stats = {
    AC: { count: 0, label: 'Activos', color: 'bg-green-100 text-green-800' },
    EJ: { count: 0, label: 'En ejecución', color: 'bg-blue-100 text-blue-800' },
    IN: { count: 0, label: 'Inactivos', color: 'bg-gray-200 text-gray-800' },
    CN: { count: 0, label: 'Cancelados', color: 'bg-red-100 text-red-800' },
    FN: { count: 0, label: 'Finalizados', color: 'bg-purple-100 text-purple-800' },
    EM: { count: 0, label: 'En mora', color: 'bg-yellow-100 text-yellow-800' }
  };

  // Count projects by status
  projects.forEach(project => {
    if (stats[project.status]) {
      stats[project.status].count++;
    }
  });

  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow">
      <h3 className="text-base font-medium mb-4">Estadísticas de Proyectos</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Object.entries(stats).map(([status, { count, label, color }]) => (
          <div key={status} className="p-3 rounded-lg border">
            <div className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${color} mb-2`}>
              {label}
            </div>
            <p className="text-base font-normal">{count}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 