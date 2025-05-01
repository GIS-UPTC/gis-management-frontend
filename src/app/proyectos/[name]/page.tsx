'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import { projectService, ProjectServiceError } from '@/services/projectService';
import { toast, Toaster } from 'react-hot-toast';
import { Project } from '@/types/models/project.models';
import ArrowLeftIcon from '@heroicons/react/24/outline/ArrowLeftIcon';
import Link from 'next/link';

export default function ProjectDetailsPage() {
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectTitle = params.name as string;
        const fetchedProject = await projectService.searchProjects(projectTitle);
        setProject(fetchedProject[0]);
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

    fetchProject();
  }, [params.id]);

  if (isLoading) {
    return (
      <>
        <Header moduleName="Proyectos" />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </>
    );
  }

  if (!project) {
    return (
      <>
        <Header moduleName="Proyectos" />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-8 text-gray-500">
            Proyecto no encontrado
          </div>
        </div>
      </>
    );
  }

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      'EJ': 'En Ejecución',
      'AC': 'Activo',
      'IN': 'Inactivo',
      'CN': 'Cancelado',
      'FN': 'Finalizado'
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status: string) => {
    const statusClassMap: Record<string, string> = {
      'EJ': 'bg-blue-100 text-blue-800',
      'AC': 'bg-green-100 text-green-800',
      'IN': 'bg-gray-200 text-gray-800',
      'CN': 'bg-red-100 text-red-800',
      'FN': 'bg-purple-100 text-purple-800'
    };
    return statusClassMap[status] || 'bg-gray-200 text-gray-800';
  };

  const getParticipationRoleLabel = (role: string) => {
    const roleMap: Record<string, string> = {
      'JI': 'Joven Investigador',
      'CI': 'CoInvestigador',
      'IP': 'Investigador Principal',
      'SE': 'Semillero',
      'EM': 'Estudiante de Maestria'
    };
    return roleMap[role] || role;
  };

  const getCooperationTypeLabel = (type: string) => {
    return type === 'EX' ? 'Externa' : 'Interna';
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await projectService.changeProjectStatus(project.id, newStatus);
      
      setIsStatusDropdownOpen(false);
      window.location.reload(); 
    } catch {
      toast.error('Error al actualizar el estado');
    }
  };

  return (
    <>
    <Toaster position="top-center" />
      <Header moduleName="Proyectos" />
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <Link href="/proyectos" className="mr-4">
            <ArrowLeftIcon className="h-8 w-8 text-black hover:text-orange-600" />
          </Link>
          <h1 className="text-2xl font-bold">Detalles del Proyecto</h1>
          <button
            onClick={() => window.location.href = `/proyectos/nuevo?edit=${encodeURIComponent(project.title)}`}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Editar Proyecto
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información básica del proyecto */}
            <div className="md:col-span-2">
              <h2 className="text-lg font-semibold mb-4">Información General</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Título del Proyecto</label>
                  <p className="mt-1 font-semibold">{project.title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Código</label>
                  <p className="mt-1">{project.code}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Estado</label>
                  <div className="relative mt-1">
                    <button
                      type="button"
                      onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                      className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${getStatusClass(project.status)}`}
                    >
                      {getStatusLabel(project.status)}
                      <svg
                        className="w-4 h-4 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {isStatusDropdownOpen && (
                      <div className="absolute z-10 mt-1 w-40 bg-white rounded-lg shadow-lg border">
                        <div className="py-1">
                          {['AC', 'IN', 'EJ', 'CN', 'FN'].map((status) => (
                            <button
                              key={status}
                              onClick={() => handleStatusChange(status)}
                              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${getStatusClass(status)}`}
                            >
                              {getStatusLabel(status)}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Línea de Investigación</label>
                  <p className="mt-1">{project.research_line.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fecha de Creación</label>
                  <p className="mt-1">{new Date(project.creation_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Duración (días)</label>
                  <p className="mt-1">{project.duration_days}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Convocatoria</label>
                  <p className="mt-1">{project.convocation}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Financiamiento</label>
                  <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full mt-1 ${project.has_financing ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'
                    }`}>
                    {project.has_financing ? 'Con Financiamiento' : 'Sin Financiamiento'}
                  </span>
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div className="md:col-span-2">
              <h2 className="text-lg font-semibold mb-2">Descripción</h2>
              <p className="text-gray-700">{project.description}</p>
            </div>

            {/* Objetivos */}
            <div className="md:col-span-2">
              <h2 className="text-lg font-semibold mb-4">Objetivos</h2>
              {project.objectives && project.objectives.length > 0 ? (
                <div className="space-y-3">
                  {project.objectives.map((objective) => (
                    <div key={objective.id} className="border-l-4 border-blue-500 pl-4 py-2">
                      <span className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full mr-2">
                        {objective.type === 'GN' ? 'General' : 'Específico'}
                      </span>
                      <span>{objective.description}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">Este proyecto no tiene objetivos registrados</p>
              )}
            </div>

            {/* Palabras clave */}
            <div className="md:col-span-2">
              <h2 className="text-lg font-semibold mb-4">Palabras Clave</h2>
              {project.project_keywords && project.project_keywords.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {project.project_keywords.map((keyword) => (
                    <span
                      key={keyword.id}
                      className="inline-block px-3 py-1 text-sm font-semibold text-gray-700 bg-gray-100 rounded-full"
                    >
                      {keyword.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">Este proyecto no tiene palabras clave asignadas</p>
              )}
            </div>

            {/* Participantes */}
            <div className="md:col-span-2">
              <h2 className="text-lg font-semibold mb-4">Participantes</h2>
              {project.participations && project.participations.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre completo</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsabilidad</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Período</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {project.participations.map((participation) => (
                        <tr key={participation.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {participation.user.first_name} {participation.user.other_name || ''} {participation.user.surname} {participation.user.other_surname || ''}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              {getParticipationRoleLabel(participation.role)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {participation.responsibility}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {new Date(participation.start_date).toLocaleDateString()} -
                            {participation.end_date
                              ? new Date(participation.end_date).toLocaleDateString()
                              : "Sin fecha final"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 italic">Este proyecto no tiene participantes registrados</p>
              )}
            </div>

            {/* Cooperaciones */}
            <div className="md:col-span-2">
              <h2 className="text-lg font-semibold mb-4">Cooperaciones</h2>
              {project.cooperation_list && project.cooperation_list.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.cooperation_list.map((cooperation) => (
                    <div key={cooperation.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${cooperation.type === 'EX' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                          {getCooperationTypeLabel(cooperation.type)}
                        </span>
                      </div>

                      {cooperation.type === 'EX' && cooperation.in_charge && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-700">Responsable Externo:</p>
                          <p>{cooperation.in_charge.first_name} {cooperation.in_charge.last_name}</p>
                          <p className="text-sm text-gray-600">DNI: {cooperation.in_charge.dni}</p>
                          <p className="text-sm text-gray-600">Entidad: {cooperation.in_charge.group_or_entity}</p>
                        </div>
                      )}

                      {cooperation.type === 'IN' && cooperation.cooperator && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-700">Cooperador Interno:</p>
                          <p>{cooperation.cooperator.first_name} {cooperation.cooperator.other_name || ''} {cooperation.cooperator.surname} {cooperation.cooperator.other_surname || ''}</p>
                          <p className="text-sm text-gray-600">Email: {cooperation.cooperator.email}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">Este proyecto no tiene cooperaciones registradas</p>
              )}
            </div>

            {/* Enlace del cronograma */}
            {project.schedule_url && (
              <div className="md:col-span-2">
                <h2 className="text-lg font-semibold mb-4">Cronograma</h2>
                <a
                  href={project.schedule_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Ver cronograma del proyecto
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}