import React, { useState, useEffect } from 'react';
import { Project, Objective, ProjectKeyword } from '@/types/models/project.models';
import { projectService } from '@/services/projectService';
import { toast, Toaster } from 'react-hot-toast';
import { Combobox } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';

interface ObjectivesSectionProps {
  formData: Omit<Project, 'id'>;
  setFormData: React.Dispatch<React.SetStateAction<Omit<Project, 'id'>>>;
}

export default function ObjectivesSection({ formData, setFormData }: ObjectivesSectionProps) {
  const [newObjective, setNewObjective] = useState({ description: '', type: 'GN' });
  const [searchKeyword, setSearchKeyword] = useState('');
  const [keywords, setKeywords] = useState<ProjectKeyword[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tempIdCounter, setTempIdCounter] = useState(-1);

  const handleAddObjective = () => {
    if (newObjective.description.trim()) {
      const objective: Objective = {
        id: Date.now(),
        description: newObjective.description.trim(),
        type: newObjective.type as "GN" | "ES"
      };

      setFormData(prev => ({
        ...prev,
        objectives: [...prev.objectives, objective]
      }));

      setNewObjective({ description: '', type: 'GN' });
    }
  };

  const handleRemoveObjective = (id: number) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.filter(obj => obj.id !== id)
    }));
  };

  const handleAddKeyword = (keyword: ProjectKeyword | string | null) => {
    if (keyword === null) return;
    
    // Si el keyword es un string, significa que es una nueva palabra clave
    if (typeof keyword === 'string') {
      // Crear una nueva palabra clave con ID temporal negativo
      const newKeyword: ProjectKeyword = {
        id: tempIdCounter,
        name: searchKeyword.trim()
      };
      
      // Actualizar el contador para el próximo ID temporal
      setTempIdCounter(prev => prev - 1);
      
      // Añadir la nueva palabra clave
      setFormData(prev => ({
        ...prev,
        project_keywords: [...prev.project_keywords, newKeyword]
      }));
    } else {
      // Es una palabra clave existente
      if (!formData.project_keywords.find(k => k.id === keyword.id)) {
        setFormData(prev => ({
          ...prev,
          project_keywords: [...prev.project_keywords, keyword]
        }));
      }
    }
    
    setSearchKeyword('');
  };

  const handleRemoveKeyword = (id: number) => {
    setFormData(prev => ({
      ...prev,
      project_keywords: prev.project_keywords.filter(k => k.id !== id)
    }));
  };

  const searchKeywords = async (query: string) => {
    if (query.length < 3) {
      setKeywords([]);
      return;
    }
    
    setIsLoading(true);
    try {
      const results = await projectService.searchKeywords(query);
      // Filtrar palabras clave que ya están seleccionadas
      const filteredKeywords = results.filter(keyword => 
        !formData.project_keywords.some(selected => selected.id === keyword.id)
      );
      setKeywords(filteredKeywords);
    } catch {
      toast.error('Error al buscar palabras clave');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchKeyword) {
        searchKeywords(searchKeyword);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchKeyword]);

  return (
    <div className="space-y-6">
      <Toaster position="top-center" />
      {/* Objectives Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Objetivos *</h3>
        <div className="space-y-4">
          {formData.objectives.map(objective => (
            <div key={objective.id} className="flex justify-between items-start p-4 bg-gray-50 rounded-lg">
              <div>
                <p>{objective.description}</p>
                <p className="text-sm text-gray-500">
                  Tipo: {objective.type === 'GN' ? 'General' : 'Específico'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveObjective(objective.id)}
                className="text-red-600 hover:text-red-800"
              >
                Eliminar
              </button>
            </div>
          ))}

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <input
              type="text"
              value={newObjective.description}
              onChange={(e) => setNewObjective(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descripción del objetivo"
              className="flex-1 p-2 border rounded-lg"
            />
            <select
              value={newObjective.type}
              onChange={(e) => setNewObjective(prev => ({ ...prev, type: e.target.value }))}
              className="p-2 border rounded-lg"
            >
              <option value="GN">General</option>
              <option value="ES">Específico</option>
            </select>
            <button
              type="button"
              onClick={handleAddObjective}
              className="px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200"
            >
              Agregar
            </button>
          </div>
        </div>
      </div>

      {/* Keywords Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Palabras Clave *</h3>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Combobox value={null} onChange={handleAddKeyword}>
              <div className="relative">
                <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left border focus-within:border-orange-500">
                  <Combobox.Input
                    className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                    displayValue={() => searchKeyword}
                    onChange={(event) => setSearchKeyword(event.target.value)}
                    placeholder="Buscar palabras clave..."
                  />
                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </Combobox.Button>
                </div>
                {isLoading ? (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                  </div>
                ) : null}
                
                <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {keywords.length === 0 && searchKeyword.length >= 3 ? (
                    <Combobox.Option
                      value="add"
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-3 pr-9 ${
                          active ? 'bg-orange-100 text-orange-900' : 'text-gray-900'
                        }`
                      }
                    >
                      <span className="flex items-center">
                      <span className="ml-3 font-normal">Crear nueva palabra clave: &quot;{searchKeyword}&quot;</span>
                      </span>
                    </Combobox.Option>
                  ) : keywords.map((keyword) => (
                    <Combobox.Option
                      key={keyword.id}
                      value={keyword}
                      className={({ active, selected }) =>
                        `relative cursor-default select-none py-2 pl-3 pr-9 ${
                          active ? 'bg-orange-100 text-orange-900' : 'text-gray-900'
                        } ${selected ? 'font-semibold' : 'font-normal'}`
                      }
                    >
                      <span className="flex items-center">
                        <span className="ml-3">{keyword.name}</span>
                      </span>
                    </Combobox.Option>
                  ))}
                </Combobox.Options>
              </div>
            </Combobox>
          </div>

          {keywords.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {keywords.map(keyword => (
                <div
                  key={keyword.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                >
                  <span>{keyword.name}</span>
                  <button
                    type="button"
                    onClick={() => handleAddKeyword(keyword)}
                    className="text-green-600 hover:text-green-800"
                  >
                    Agregar
                  </button>
                </div>
              ))}
            </div>
          )}

          {formData.project_keywords.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.project_keywords.map(keyword => (
                <div
                  key={keyword.id}
                  className="flex items-center space-x-2 px-3 py-1 bg-orange-100 rounded-full"
                >
                  <span>{keyword.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(keyword.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 