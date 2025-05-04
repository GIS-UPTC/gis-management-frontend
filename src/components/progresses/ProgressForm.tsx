'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Progress, User } from '@/types/models/GeneralModels';
import { userService } from '@/services/userService';
import { projectService } from '@/services/projectService';
import { toast, Toaster } from 'react-hot-toast';
import { XMarkIcon, DocumentIcon } from '@heroicons/react/24/outline';
import { Project } from '@/types/models/project.models';
import { progressService } from '@/services/progressesService';
import SearchBar from '@/components/ui/SearchBar';

interface FormData extends Omit<Progress, 'id' | 'user_id' | 'project_id' | 'user' | 'project'> {
  id?: number;
  user: User | null;
  project: Project | null;
}

const initialFormData: FormData = {
  user: null,
  project: null,
  date: null,
  type: "PI",
  document_link: null,
  description: null
};

interface FileInfo {
  file: File | null;
  name: string;
  size: string;
}

interface ProgressFormProps {
  onSuccess?: () => void;
}

export default function ProgressForm({ onSuccess }: ProgressFormProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [userQuery, setUserQuery] = useState('');
  const [projectQuery, setProjectQuery] = useState('');
  const [userResults, setUserResults] = useState<User[]>([]);
  const [projectResults, setProjectResults] = useState<Project[]>([]);
  const [isSearchingUser, setIsSearchingUser] = useState(false);
  const [isSearchingProject, setIsSearchingProject] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUserResults, setShowUserResults] = useState(false);
  const [showProjectResults, setShowProjectResults] = useState(false);
  const [fileInfo, setFileInfo] = useState<FileInfo>({ file: null, name: '', size: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const progressTypes = [
    { value: "PI", label: "Propuesta Inicial" },
    { value: "IO", label: "Informe Operativo o de Avance" },
    { value: "IF", label: "Informe Financiero" },
    { value: "FI", label: "Informe Final" }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      // Convertir bytes a formato legible
      let size = file.size;
      const units = ['B', 'KB', 'MB', 'GB'];
      let unitIndex = 0;
      
      while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
      }
      
      const formattedSize = `${size.toFixed(2)} ${units[unitIndex]}`;
      
      setFileInfo({
        file,
        name: file.name,
        size: formattedSize
      });
    } else {
      setFileInfo({ file: null, name: '', size: '' });
    }
  };
  
  const handleRemoveFile = () => {
    setFileInfo({ file: null, name: '', size: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSearchUser = async (query: string) => {
    setUserQuery(query);
    if (query.length < 2) {
      setUserResults([]);
      return;
    }

    setIsSearchingUser(true);
    try {
      const results = await userService.searchUsersByName(query);
      setUserResults(results);
      setShowUserResults(true);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
      setUserResults([]);
    } finally {
      setIsSearchingUser(false);
    }
  };

  const handleSearchProject = async (query: string) => {
    setProjectQuery(query);
    if (query.length < 3) {
      setProjectResults([]);
      return;
    }

    setIsSearchingProject(true);
    try {
      const results = await projectService.searchProjects(query);
      setProjectResults(results);
      setShowProjectResults(true);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
      setProjectResults([]);
    } finally {
      setIsSearchingProject(false);
    }
  };

  const handleSelectUser = (user: User) => {
    setFormData(prev => ({
      ...prev,
      user
    }));
    setShowUserResults(false);
    setUserQuery('');
  };

  const handleSelectProject = (project: Project) => {
    setFormData(prev => ({
      ...prev,
      project
    }));
    setShowProjectResults(false);
    setProjectQuery('');
  };

  const handleRemoveUser = () => {
    setFormData(prev => ({
      ...prev,
      user: null
    }));
  };

  const handleRemoveProject = () => {
    setFormData(prev => ({
      ...prev,
      project: null
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validar que exista usuario y proyecto
    if (!formData.user) {
      setError('Debe seleccionar un usuario');
      setIsSubmitting(false);
      return;
    }

    if (!formData.project) {
      setError('Debe seleccionar un proyecto');
      setIsSubmitting(false);
      return;
    }

    if (!fileInfo && !formData.description) {
      setError('Debe seleccionar un archivo o descripción');
      setIsSubmitting(false);
      return;
    }

    try {
      const progressData: Omit<Progress, 'id'> = {
        user: formData.user,
        project: formData.project,
        date: null,
        type: formData.type,
        document_link: null,
        description: formData.description,
        user_id: formData.user.id,
        project_id: formData.project.id
      };

      await progressService.createProgress(progressData, fileInfo.file || undefined);
      toast.success('Avance creado exitosamente');
      
      // Resetear formulario
      setFormData(initialFormData);
      setFileInfo({ file: null, name: '', size: '' });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Llamar al callback de éxito si existe
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error saving progress:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al guardar el avance';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cerrar los dropdowns cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = () => {
      setShowUserResults(false);
      setShowProjectResults(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <form onSubmit={handleSubmit} className="bg-customLightYellow rounded-lg shadow max-w-4xl mx-auto p-6">
      <Toaster position="top-center" />
      <div className="space-y-6">
        {/* Usuario */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Usuario *
          </label>
          <div className="relative">
            {formData.user ? (
              <div className="flex items-center justify-between p-2 border rounded-lg bg-white">
                <div>
                  <span className="font-medium">{formData.user.first_name} {formData.user.other_name ?? ''} {formData.user.surname} {formData.user.other_surname ?? ''}</span>
                  {formData.user.email && (
                    <span className="ml-2 text-sm text-gray-500">{formData.user.email}</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleRemoveUser}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            ) : (
              <div onClick={(e) => e.stopPropagation()}>
                <SearchBar
                  onSearch={handleSearchUser}
                  isLoading={isSearchingUser}
                  placeholder="Buscar usuario por nombre..."
                />
                
                {showUserResults && userResults.length > 0 && (
                  <div className="absolute mt-1 w-full z-10 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                    {userResults.map((user) => (
                      <div
                        key={user.id}
                        className="p-3 hover:bg-orange-100 cursor-pointer border-b"
                        onClick={() => handleSelectUser(user)}
                      >
                        <div className="font-medium">{user.first_name} {user.other_name ?? ''} {user.surname} {user.other_surname ?? ''}</div>
                        {user.email && <div className="text-sm text-gray-500">{user.email}</div>}
                      </div>
                    ))}
                  </div>
                )}
                
                {showUserResults && userQuery.length >= 3 && userResults.length === 0 && !isSearchingUser && (
                  <div className="absolute mt-1 w-full z-10 bg-white border rounded-md shadow-lg p-3">
                    No se encontraron usuarios
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Proyecto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Proyecto *
          </label>
          <div className="relative">
            {formData.project ? (
              <div className="flex items-center justify-between p-2 border rounded-lg bg-white">
                <div>
                  <span className="font-medium">{formData.project.title}</span>
                  {formData.project.description && (
                    <span className="ml-2 text-sm text-gray-500">
                      {formData.project.description.substring(0, 50)}
                      {formData.project.description.length > 50 ? '...' : ''}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleRemoveProject}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            ) : (
              <div onClick={(e) => e.stopPropagation()}>
                <SearchBar
                  onSearch={handleSearchProject}
                  isLoading={isSearchingProject}
                  placeholder="Buscar proyecto por nombre..."
                />
                
                {showProjectResults && projectResults.length > 0 && (
                  <div className="absolute mt-1 w-full z-10 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                    {projectResults.map((project) => (
                      <div
                        key={project.id}
                        className="p-3 hover:bg-orange-100 cursor-pointer border-b"
                        onClick={() => handleSelectProject(project)}
                      >
                        <div className="font-medium">{project.title}</div>
                        {project.description && (
                          <div className="text-sm text-gray-500">
                            {project.description.substring(0, 50)}
                            {project.description.length > 50 ? '...' : ''}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {showProjectResults && projectQuery.length >= 3 && projectResults.length === 0 && !isSearchingProject && (
                  <div className="absolute mt-1 w-full z-10 bg-white border rounded-md shadow-lg p-3">
                    No se encontraron proyectos
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Tipo de Avance */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Avance *
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg"
            required
          >
            {progressTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Archivo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Archivo del Avance
          </label>
          <div className="mb-2">
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              ref={fileInputRef}
              id="file-upload"
              accept=".pdf, .doc, .docx, .xls, .xlsx"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer px-4 py-2 bg-orange-100 text-orange-800 hover:bg-orange-200 rounded-lg inline-flex items-center"
            >
              <DocumentIcon className="h-5 w-5 mr-2" />
              Seleccionar archivo <span className="text-red-500">*pdf, doc, docx, xls, xlsx</span>
            </label>
          </div>
          
          {fileInfo.file && (
            <div className="mt-2 p-3 bg-gray-50 border rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{fileInfo.name}</p>
                  <p className="text-sm text-gray-500">{fileInfo.size}</p>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="p-1 hover:bg-gray-200 rounded-full"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción
          </label>
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={handleInputChange}
            rows={4}
            className="w-full p-2 border rounded-lg"
            placeholder="Describe el avance..."
          />
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200"
            onClick={() => window.history.back()}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </form>
  );
}