import React, { useState } from 'react';
import { User, InterestTopic, Link as UserLink, GroupParticipation, RoleGranting, Program } from '@/types/models/GeneralModels';
import { userService } from '@/services/userService';
import TopicSelector from './TopicSelector';
import ProgramSelector from './ProgramSelector';
import RoleSelector from './RoleSelector';
import { toast } from 'react-hot-toast';

interface FormData extends Omit<User, 'id'> {
  id?: number;
  document_type?: string;
}

const initialFormData: FormData = {
  dni: '',
  document_type: '',
  first_name: '',
  surname: '',
  other_name: '',
  other_surname: '',
  email: '',
  birthdate: '',
  photo_url: '',
  entry_date: '',
  links: [],
  is_Active: true,
  deparure_date: '',
  interest_topics: [],
  participations: [],
  role_granting_list: [],
  program: null as unknown as Program,
  is_group_leader: false,
  is_main_researcher: false
};

export default function UserForm() {
  const [activeTab, setActiveTab] = useState<'personal' | 'complementary'>('personal');
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [newLink, setNewLink] = useState({ name: '', link: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddLink = () => {
    if (newLink.name && newLink.link) {
      setFormData(prev => ({
        ...prev,
        links: [...prev.links, { id: Date.now(), ...newLink }]
      }));
      setNewLink({ name: '', link: '' });
    }
  };

  const handleRemoveLink = (id: number) => {
    setFormData(prev => ({
      ...prev,
      links: prev.links.filter(link => link.id !== id)
    }));
  };

  const handleTopicsChange = (topics: InterestTopic[]) => {
    setFormData(prev => ({
      ...prev,
      interest_topics: topics
    }));
  };

  const handleProgramChange = (program: Program) => {
    setFormData(prev => ({
      ...prev,
      program
    }));
  };

  const handleRoleGrantingsChange = (roleGrantings: RoleGranting[]) => {
    setFormData(prev => ({
      ...prev,
      role_granting_list: roleGrantings
    }));
  };

  const handlePersonalNext = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveTab('complementary');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Convert form data to match User interface
      const userData: Omit<User, 'id'> = {
        dni: formData.dni,
        first_name: formData.first_name,
        surname: formData.surname,
        other_name: formData.other_name,
        other_surname: formData.other_surname,
        email: formData.email,
        birthdate: formData.birthdate,
        photo_url: formData.photo_url,
        entry_date: formData.entry_date,
        links: formData.links,
        is_Active: formData.is_Active,
        deparure_date: formData.deparure_date || null,
        interest_topics: formData.interest_topics,
        participations: formData.participations,
        role_granting_list: formData.role_granting_list,
        program: formData.program,
        is_group_leader: formData.is_group_leader,
        is_main_researcher: formData.is_main_researcher
      };

      await userService.createUser(userData);
      toast.success('Usuario creado exitosamente');
      window.location.href = '/users';
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Error al crear el usuario');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={activeTab === 'personal' ? handlePersonalNext : handleSubmit} className="bg-white rounded-lg shadow max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row border-b">
        <button
          type="button"
          className={`flex-1 py-4 px-6 text-center ${
            activeTab === 'personal'
              ? 'bg-yellow-100 text-yellow-800 font-semibold'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          }`}
          onClick={() => setActiveTab('personal')}
        >
          Información personal
        </button>
        <button
          type="button"
          className={`flex-1 py-4 px-6 text-center ${
            activeTab === 'complementary'
              ? 'bg-orange-100 text-orange-800 font-semibold'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          }`}
          onClick={() => setActiveTab('complementary')}
        >
          Información Complementaria
        </button>
      </div>

      <div className="p-4 sm:p-6">
        {activeTab === 'personal' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="col-span-1 sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de documento *
              </label>
              <input
                type="text"
                name="dni"
                value={formData.dni}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primer Nombre *
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Otros nombres
              </label>
              <input
                type="text"
                name="other_name"
                value={formData.other_name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primer Apellido *
              </label>
              <input
                type="text"
                name="surname"
                value={formData.surname}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Segundo Apellido
              </label>
              <input
                type="text"
                name="other_surname"
                value={formData.other_surname}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo electrónico *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Nacimiento *
              </label>
              <input
                type="date"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div className="col-span-1 sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Foto de perfil
              </label>
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                  {formData.photo_url ? (
                    <img
                      src={formData.photo_url}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-gray-400">No image</span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    // TODO: Implementar la lógica de carga de imagen
                  }}
                  className="w-full sm:w-auto"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Ingreso *
              </label>
              <input
                type="date"
                name="entry_date"
                value={formData.entry_date}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Salida
              </label>
              <input
                type="date"
                name="deparure_date"
                value={formData.deparure_date || ''}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div className="col-span-1 sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <div className="flex items-center">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.is_Active}
                    onChange={(e) =>
                      setFormData(prev => ({ ...prev, is_Active: e.target.checked }))
                    }
                    className="form-checkbox h-4 w-4 text-orange-600"
                  />
                  <span>Activo</span>
                </label>
              </div>
            </div>

            {/* Enlaces */}
            <div className="col-span-1 sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enlaces
              </label>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <input
                    type="text"
                    placeholder="Nombre del enlace"
                    value={newLink.name}
                    onChange={(e) => setNewLink(prev => ({ ...prev, name: e.target.value }))}
                    className="flex-1 p-2 border rounded-lg"
                  />
                  <input
                    type="url"
                    placeholder="URL"
                    value={newLink.link}
                    onChange={(e) => setNewLink(prev => ({ ...prev, link: e.target.value }))}
                    className="flex-1 p-2 border rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleAddLink}
                    className="px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200"
                  >
                    Agregar
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.links.map(link => (
                    <div key={link.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-2 bg-gray-50 rounded-lg space-y-2 sm:space-y-0">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                        <span className="font-medium">{link.name}</span>
                        <span className="hidden sm:inline">-</span>
                        <a href={link.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                          {link.link}
                        </a>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveLink(link.id)}
                        className="text-red-600 hover:text-red-800 sm:ml-4"
                      >
                        Eliminar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Participaciones */}
            <div className="col-span-1 sm:col-span-2">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Programa
                  </label>
                  <ProgramSelector
                    selectedProgram={formData.program}
                    onProgramChange={handleProgramChange}
                  />
                </div>
              </div>
            </div>

            {/* Tópicos de interés */}
            <div className="col-span-1 sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tópicos de interés
              </label>
              <TopicSelector
                selectedTopics={formData.interest_topics}
                onTopicsChange={handleTopicsChange}
              />
            </div>

            {/* Roles y permisos */}
            <div className="col-span-1 sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Roles y permisos
              </label>
              <RoleSelector
                selectedRoleGrantings={formData.role_granting_list}
                onRoleGrantingsChange={handleRoleGrantingsChange}
              />
            </div>
          </div>
        )}

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
            {isSubmitting ? 'Guardando...' : (activeTab === 'personal' ? 'Siguiente' : 'Guardar')}
          </button>
        </div>
      </div>
    </form>
  );
} 