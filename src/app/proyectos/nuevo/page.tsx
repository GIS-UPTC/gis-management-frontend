'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import ProjectForm from '@/components/projects/ProjectForm';
import { Project } from '@/types/models/project.models';
import { projectService, ProjectServiceError } from '@/services/projectService';
import { toast } from 'react-hot-toast';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function NewProjectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isEditing, setIsEditing] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const editProject = searchParams.get('edit')
    if(editProject){
      setIsEditing(true)
      fetchProject(editProject)
    }
  }, [searchParams]);

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
      } else {
        console.log(projectData)
        await projectService.createProject(projectData);
        toast.success('Proyecto creado exitosamente');
      }
      router.push('/proyectos');
    } catch {
      toast.error('Error al guardar el proyecto');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
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
        ) : (
          <ProjectForm 
            initialData={project} 
            onSubmit={handleSubmit} 
            isEditing={isEditing}
          />
        )}
      </div>
    </>
  );
} 