'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import { toast } from 'react-hot-toast';
import { Project } from '@/types/models/project.models';
import ProjectTable from '@/components/projects/ProjectTable';
import { projectService } from '@/services/projectService';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const allProjects = await projectService.fetchProjects(' ');
        setProjects(allProjects);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error al cargar los proyectos. Por favor, intente nuevamente.';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []);

  return (
    <>
      <Header moduleName="Proyectos" />
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Listado de Proyectos</h1>
          <Link
            href="/proyectos/nuevo"
            className="bg-customDarkGreen hover:bg-green-200 text-black font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Agregar Proyecto...
          </Link>
        </div>

        {error ? (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        ) : isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : projects.length > 0 ? (
          <div className="bg-white rounded-lg shadow">
            <ProjectTable projects={projects} />
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No hay proyectos registrados
          </div>
        )}
      </div>
    </>
  );
}