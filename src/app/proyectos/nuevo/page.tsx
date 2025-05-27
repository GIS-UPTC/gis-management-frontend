'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import ProjectForm from '@/components/projects/ProjectForm';
import { Project } from '@/types/models/project.models';
import { projectService, ProjectServiceError } from '@/services/projectService';
import { toast, Toaster } from 'react-hot-toast';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { checkUserPermission, AVAILABLE_PERMISSIONS } from '@/utils/permissionChecker';

export default function NewProjectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isEditing, setIsEditing] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    // Verificar permisos del usuario
    const checkPermissions = () => {
      const editProject = searchParams.get('edit');
      const requiredPermission = editProject ? AVAILABLE_PERMISSIONS.EDIT : AVAILABLE_PERMISSIONS.CREATE;
      
      const hasRequiredPermission = checkUserPermission(requiredPermission);
      setHasPermission(hasRequiredPermission);
      
      if (!hasRequiredPermission) {
        toast.error('No tienes permiso para ' + (editProject ? 'editar' : 'crear') + ' proyectos');
        router.push('/proyectos');
        return;
      }
      
      if (editProject) {
        setIsEditing(true);
        fetchProject(editProject);
      }
    };
    
    checkPermissions();
  }, [searchParams, router]);

  const fetchProject = async (projectTitle: string) => {
    setIsLoading(true);
    try {
      const searchResults = await projectService.searchProjects(projectTitle);
      if (searchResults.length > 0) {
        setProject(searchResults[0]);
      } else {
        toast.error('Proyecto no encontrado');
      }
    } catch (error) {
      if (error instanceof ProjectServiceError) {
        toast.error(error.message);
      } else {
        const errorMessage = 'Ocurrió un error inesperado. Por favor, intente nuevamente.';
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (projectData: Omit<Project, 'id'>) => {
    try {
      setIsLoading(true);
      if (isEditing && project) {
        await projectService.updateProject(project.id, projectData);
        toast.success('Proyecto actualizado exitosamente');
        router.push('/proyectos');
      } else {
        await projectService.createProject(projectData);
        toast.success('Proyecto creado exitosamente');
        router.push('/proyectos');
      }
    } catch (error) {
      if (error instanceof ProjectServiceError) {
        toast.error(error.message);
      } else {
        toast.error('Error al guardar el proyecto. Por favor, intente nuevamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <Header moduleName="Proyectos" />
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link href="/proyectos" className="mr-4">
            <ArrowLeftIcon className="h-8 w-8 text-black hover:text-orange-600" />
          </Link>
          <h1 className="text-2xl font-bold">
            {isEditing ? 'Editar Proyecto' : 'Nuevo Proyecto'}
          </h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : hasPermission ? (
          <ProjectForm 
            initialData={project} 
            onSubmit={handleSubmit} 
            isEditing={isEditing}
          />
        ) : (
          <div className="text-center py-8 text-red-500">
            No tienes permiso para {isEditing ? 'editar' : 'crear'} proyectos
          </div>
        )}
      </div>
    </>
  );
} 