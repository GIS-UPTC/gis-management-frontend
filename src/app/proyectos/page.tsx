'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import { toast, Toaster } from 'react-hot-toast';
import { Project } from '@/types/models/project.models';
import ProjectTable from '@/components/projects/ProjectTable';
import { projectService } from '@/services/projectService';
import SearchBar from '@/components/ui/SearchBar';
import { checkUserPermission, AVAILABLE_PERMISSIONS } from '@/utils/permissionChecker';

export default function ProjectsPage() {
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canCreateProject, setCanCreateProject] = useState(false);
  const [canChangeStatus, setCanChangeStatus] = useState(false);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const allProjects = await projectService.fetchProjects(' ');
        setAllProjects(allProjects);
        setFilteredProjects(allProjects);
        
        // Verificar si el usuario tiene permisos para crear proyectos y cambiar estado
        const hasCreatePermission = checkUserPermission(AVAILABLE_PERMISSIONS.CREATE);
        const hasChangeStatusPermission = checkUserPermission(AVAILABLE_PERMISSIONS.CHANGE_STATUS);
        setCanCreateProject(hasCreatePermission);
        setCanChangeStatus(hasChangeStatusPermission);
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
    <Toaster position="top-center" />
      <Header moduleName="Proyectos" />
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Listado de Proyectos</h1>
          {canCreateProject && (
            <Link
              href="/proyectos/nuevo"
              className="bg-customDarkGreen hover:bg-green-200 text-black font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Agregar Proyecto
            </Link>
          )}
        </div>
        <div className="mb-6">
          <SearchBar
            onSearch={(query) => {
              if (query.length === 0) {
                setFilteredProjects(allProjects);
              } else {
                const filtered = allProjects.filter(project =>
                  project.title.toLowerCase().includes(query.toLowerCase())
                );
                setFilteredProjects(filtered);
              }
            }}
            placeholder="Buscar proyecto..."
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
        ) : filteredProjects.length > 0 ? (
          <div className="bg-white rounded-lg shadow">
            <ProjectTable 
              projects={filteredProjects} 
              onStatusChange={() => {
                // Recargar los proyectos cuando se cambie el estado
                const loadProjects = async () => {
                  try {
                    const allProjects = await projectService.fetchProjects(' ');
                    setAllProjects(allProjects);
                    setFilteredProjects(allProjects);
                  } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error al cargar los proyectos. Por favor, intente nuevamente.';
                    setError(errorMessage);
                    toast.error(errorMessage);
                  }
                };
                loadProjects();
              }}
              canChangeStatus={canChangeStatus}
            />
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