import React, { useState, useEffect } from 'react';
import { Project, Objective, ProjectKeyword } from '@/types/models/project.models';
import { projectService } from '@/services/projectService';
import { toast } from 'react-hot-toast';

interface ObjectivesSectionProps {
  formData: Omit<Project, 'id'>;
  setFormData: React.Dispatch<React.SetStateAction<Omit<Project, 'id'>>>;
}

export default function ObjectivesSection({ formData, setFormData }: ObjectivesSectionProps) {
  const [newObjective, setNewObjective] = useState({ description: '', type: 'GN' });
  const [searchKeyword, setSearchKeyword] = useState('');
  const [keywords, setKeywords] = useState<ProjectKeyword[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleAddKeyword = (keyword: ProjectKeyword) => {
    if (!formData.project_keywords.some(k => k.id === keyword.id)) {
      setFormData(prev => ({
        ...prev,
        project_keywords: [...prev.project_keywords, keyword]
      }));
    }
  };

  const handleRemoveKeyword = (id: number) => {
    setFormData(prev => ({
      ...prev,
      project_keywords: prev.project_keywords.filter(k => k.id !== id)
    }));
  };

  const searchKeywords = async (query: string) => {
    if (query.length < 3) return;
    
    try {
      setIsLoading(true);
      const results = await projectService.searchKeywords(query);
      setKeywords(results);
    } catch (error) {
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
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Buscar palabras clave..."
              className="flex-1 p-2 border rounded-lg"
            />
            {isLoading && (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
              </div>
            )}
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