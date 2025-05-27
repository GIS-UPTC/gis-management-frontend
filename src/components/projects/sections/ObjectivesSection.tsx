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
  const [newSpecificObjective, setNewSpecificObjective] = useState({ description: '', parentId: 0 });
  const [searchKeyword, setSearchKeyword] = useState('');
  const [allKeywords, setAllKeywords] = useState<ProjectKeyword[]>([]);
  const [filteredKeywords, setFilteredKeywords] = useState<ProjectKeyword[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tempIdCounter, setTempIdCounter] = useState(-1);

  // Cargar todas las palabras clave al inicio
  useEffect(() => {
    const loadKeywords = async () => {
      setIsLoading(true);
      try {
        const keywords = await projectService.fetchKeywords(' ');
        setAllKeywords(keywords);
        setFilteredKeywords(keywords);
      } catch (error) {
        toast.error('Error al cargar las palabras clave');
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadKeywords();
  }, []);

  // Filtrar palabras clave localmente cuando cambia el término de búsqueda
  useEffect(() => {
    if (searchKeyword.trim() === '') {
      setFilteredKeywords(allKeywords);
    } else {
      const filtered = allKeywords.filter(keyword => 
        keyword.name.toLowerCase().includes(searchKeyword.toLowerCase()) &&
        !formData.project_keywords.some(selected => selected.id === keyword.id)
      );
      setFilteredKeywords(filtered);
    }
  }, [searchKeyword, allKeywords, formData.project_keywords]);

  // Agregar objetivo general (solo puede haber uno)
  const handleAddGeneralObjective = () => {
    if (newObjective.description.trim()) {
      const objective: Objective = {
        id: Date.now(),
        description: newObjective.description.trim(),
        type: "GN",
        objectives: [] // Lista vacía de objetivos específicos
      };

      setFormData(prev => ({
        ...prev,
        objective: objective
      }));

      setNewObjective({ description: '', type: 'GN' });
    }
  };

  // Agregar objetivo específico al objetivo general
  const handleAddSpecificObjective = () => {
    if (newSpecificObjective.description.trim() && formData.objective) {
      const specificObjective: Objective = {
        id: Date.now(),
        description: newSpecificObjective.description.trim(),
        type: "ES",
        objectives: [] // Los objetivos específicos también pueden tener sub-objetivos
      };

      // Crear una copia profunda del objetivo general con sus objetivos específicos
      const updatedObjective = {
        ...formData.objective,
        objectives: [...(formData.objective.objectives || []), specificObjective]
      };

      setFormData(prev => ({
        ...prev,
        objective: updatedObjective
      }));

      setNewSpecificObjective({ description: '', parentId: 0 });
    }
  };

  // Eliminar el objetivo general
  const handleRemoveGeneralObjective = () => {
    setFormData(prev => ({
      ...prev,
      objective: {
        id: 0,
        description: '',
        type: 'GN',
        objectives: []
      }
    }));
  };

  // Eliminar un objetivo específico
  const handleRemoveSpecificObjective = (id: number) => {
    if (formData.objective) {
      const updatedObjective = {
        ...formData.objective,
        objectives: formData.objective.objectives.filter(obj => obj.id !== id)
      };

      setFormData(prev => ({
        ...prev,
        objective: updatedObjective
      }));
    }
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

  return (
    <div className="space-y-6">
      <Toaster position="top-center" />
      {/* General Objective Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Objetivo General *</h3>
        <div className="space-y-4">
          {formData.objective.description !== '' ? (
            <div className="flex justify-between items-start p-4 bg-gray-50 rounded-lg">
              <div>
                <p>{formData.objective.description}</p>
                <p className="text-sm text-gray-500">Tipo: General</p>
              </div>
              <button
                type="button"
                onClick={handleRemoveGeneralObjective}
                className="text-red-600 hover:text-red-800"
              >
                Eliminar
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <input
                type="text"
                value={newObjective.description}
                onChange={(e) => setNewObjective(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descripción del objetivo general"
                className="flex-1 p-2 border rounded-lg"
              />
              <button
                type="button"
                onClick={handleAddGeneralObjective}
                className="px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200"
              >
                Agregar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Specific Objectives Section */}
      {formData.objective && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Objetivos Específicos</h3>
          <div className="space-y-4">
            {formData.objective.objectives && formData.objective.objectives.length > 0 && (
              <div className="space-y-2">
                {formData.objective.objectives.map(specificObjective => (
                  <div key={specificObjective.id} className="flex justify-between items-start p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p>{specificObjective.description}</p>
                      <p className="text-sm text-gray-500">Tipo: Específico</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSpecificObjective(specificObjective.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <input
                type="text"
                value={newSpecificObjective.description}
                onChange={(e) => setNewSpecificObjective(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descripción del objetivo específico"
                className="flex-1 p-2 border rounded-lg"
              />
              <button
                type="button"
                onClick={handleAddSpecificObjective}
                className="px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200"
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}

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
                  {filteredKeywords.length === 0 && searchKeyword.length >= 3 ? (
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
                  ) : filteredKeywords.map((keyword) => (
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

          {/* Lista de todas las palabras clave disponibles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {allKeywords
              .filter(keyword => !formData.project_keywords.some(selected => selected.id === keyword.id))
              .map(keyword => (
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

          {/* Palabras clave seleccionadas */}
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