import React, { useState } from 'react';
import { Project } from '@/types/models/project.models';

import BasicInfoSection from './sections/BasicInfoSection';
import CooperationSection from './sections/CooperationSection';
import { toast, Toaster } from 'react-hot-toast';
import ObjectivesSection from './sections/ObjectivesSection';
import TeamSection from './sections/TeamSection';

interface ProjectFormProps {
  initialData?: Project | null;
  onSubmit: (data: Omit<Project, 'id'>) => void;
  isEditing?: boolean;
}

const initialFormData: Omit<Project, 'id'> = {
  title: '',
  code: '',
  description: '',
  creation_date: '',
  duration_type: 'DD',
  duration: 0,
  schedule_url: '',
  convocation: '',
  status: 'EJ',
  has_financing: false,
  research_line: {
    id: 0,
    name: '',
    is_active: true,
    coordinator: {
      id: 0,
      dni_type: 'CC',
      dni: '',
      first_name: '',
      surname: '',
      email: '',
      birthdate: '',
      photo_url: '',
      entry_date: '',
      links: [],
      is_Active: true,
      deparure_date: '',
      other_name: '',
      other_surname: '',
      interest_topics: [],
      participations: [],
      responsibilities: [],
      program: {
        id: 0,
        name: '',
        faculty: {
          id: 0,
          name: '',
          university: {
            id: 0,
            name: '',
            place: {
              id: 0,
              name: '',
              place: null
            }
          },
          place: null
        },
        is_diurn: true
      },
      role_granting_list: [],
      is_group_leader: false,
      is_main_researcher: false
    }
  },
  research_line_id: 0,
  objective: {
    id: 0,
    description: '',
    type: 'GN',
    objectives: []
  },
  project_keywords: [],
  participations: [],
  cooperation_list: []
};

export default function ProjectForm({ initialData, onSubmit }: ProjectFormProps) {
  const [activeSection, setActiveSection] = useState<'basic' | 'objectives' | 'team' | 'cooperation'>('basic');
  const [formData, setFormData] = useState<Omit<Project, 'id'>>(initialData || initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Solo enviar el formulario si estamos en la última sección
    if (activeSection === 'cooperation') {
      setIsSubmitting(true);

      try {
        // Validate required fields
        if (!formData.title || !formData.description || !formData.creation_date) {
          toast.error('Por favor complete todos los campos requeridos');
          return;
        }

        onSubmit(formData);
      } catch {
        toast.error('Error al guardar el proyecto');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Navegar a la siguiente sección
      const sections: ('basic' | 'objectives' | 'team' | 'cooperation')[] = ['basic', 'objectives', 'team', 'cooperation'];
      const currentIndex = sections.indexOf(activeSection);
      if (currentIndex < sections.length - 1) {
        setActiveSection(sections[currentIndex + 1]);
      }
    }
  };

  const renderSection = () => {
    console.log(formData)
    switch (activeSection) {
      case 'basic':
        return (
          <BasicInfoSection
            formData={formData}
            onInputChange={handleInputChange}
            onCheckboxChange={handleCheckboxChange}
          />
        );
      case 'objectives':
        return (
          <ObjectivesSection
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 'team':
        return (
          <TeamSection
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 'cooperation':
        return (
          <CooperationSection
            formData={formData}
            setFormData={setFormData}
          />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-customLightYellow rounded-lg shadow max-w-4xl mx-auto">
      <Toaster position="top-center" />
      <div className="flex flex-col sm:flex-row border-b">
        <button
          type="button"
          className={`flex-1 py-4 px-6 text-center ${
            activeSection === 'basic'
              ? 'bg-customLightYellow text-black font-semibold'
              : 'bg-customDarkYellow text-black font-semibold hover:bg-customMiddleYellow'
          }`}
          onClick={() => setActiveSection('basic')}
        >
          Información Básica
        </button>
        <button
          type="button"
          className={`flex-1 py-4 px-6 text-center ${
            activeSection === 'objectives'
              ? 'bg-customLightYellow text-black font-semibold'
              : 'bg-customDarkYellow text-black font-semibold hover:bg-customMiddleYellow'
          }`}
          onClick={() => setActiveSection('objectives')}
        >
          Objetivos y Palabras Clave
        </button>
        <button
          type="button"
          className={`flex-1 py-4 px-6 text-center ${
            activeSection === 'team'
              ? 'bg-customLightYellow text-black font-semibold'
              : 'bg-customDarkYellow text-black font-semibold hover:bg-customMiddleYellow'
          }`}
          onClick={() => setActiveSection('team')}
        >
          Equipo y Línea de Investigación
        </button>
        <button
          type="button"
          className={`flex-1 py-4 px-6 text-center ${
            activeSection === 'cooperation'
              ? 'bg-customLightYellow text-black font-semibold'
              : 'bg-customDarkYellow text-black font-semibold hover:bg-customMiddleYellow'
          }`}
          onClick={() => setActiveSection('cooperation')}
        >
          Cooperaciones
        </button>
      </div>

      <div className="p-4 sm:p-6">
        {renderSection()}

        <div className="mt-6 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
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
            {isSubmitting ? 'Guardando...' : (activeSection === 'cooperation' ? 'Guardar' : 'Siguiente')}
          </button>
        </div>
      </div>
    </form>
  );
} 