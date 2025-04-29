import React, { useState, useEffect } from 'react';
import { User, InterestTopic, Link as UserLink, GroupParticipation, RoleGranting, Program, Responsability } from '@/types/models/GeneralModels';
import { userService } from '@/services/userService';
import TopicSelector from './TopicSelector';
import ProgramSelector from './ProgramSelector';
import RoleSelector from './RoleSelector';
import { toast, Toaster } from 'react-hot-toast';
import ResponsabilitiesSelector from './ResponsabilitiesSelector';
import DialogAddProgram from './DialogAddProgramProps';

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
  responsabilities: [],
  program: null as unknown as Program,
  is_group_leader: false,
  is_main_researcher: false
};

interface UserFormProps {
  initialData?: User | null;
  isEditing?: boolean;
}

export default function UserForm({ initialData, isEditing = false }: UserFormProps) {
  const [activeTab, setActiveTab] = useState<'personal' | 'complementary'>('personal');
  const [formData, setFormData] = useState<FormData>(initialData || initialFormData);
  const [newLink, setNewLink] = useState({ name: '', link: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        responsabilities: initialData.responsabilities || []
      });
      if (initialData.photo_url) {
        setPreviewUrl(initialData.photo_url);
      }
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'dni') {
      const numValue = e.target.value.replace(/\D/g, '')
      setFormData(prev => ({
        ...prev,
        [name]: numValue
      }));
    }else{
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
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

  const handleResponsabilitiesChange = (responsabilities: Responsability[]) => {
    setFormData(prev => ({
      ...prev,
      responsabilities: responsabilities
    }))
  };

  const handleProgramChange = (program: Program) => {
    console.log(program)
    setFormData(prev => ({
      ...prev,
      program
    }));
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);

      return () => URL.revokeObjectURL(fileUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
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
        deparure_date: formData.deparure_date,
        interest_topics: formData.interest_topics,
        participations: formData.participations,
        role_granting_list: formData.role_granting_list,
        responsabilities: formData.responsabilities,
        program: formData.program,
        is_group_leader: formData.is_group_leader,
        is_main_researcher: formData.is_main_researcher
      };

      if (isEditing && initialData?.id) {
        await userService.updateUser(initialData.id, userData);
        toast.success('Usuario actualizado exitosamente');
      } else {
        await userService.createUser(userData, selectedFile || undefined);
        toast.success('Usuario creado exitosamente');
      }
      window.location.href = '/usuarios';
    } catch (error) {
      console.error('Error saving user:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al guardar el usuario';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <Toaster position="top-center" />
      <form onSubmit={activeTab === 'personal' ? handlePersonalNext : handleSubmit} className="bg-customLightYellow rounded-lg shadow max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row border-b">
          <button
            type="button"
            className={`flex-1 py-4 px-6 text-center ${activeTab === 'personal'
              ? 'bg-customLightYellow text-black font-semibold'
              : 'bg-customDarkYellow text-black font-semibold hover:bg-customMiddleYellow'
              }`}
            onClick={() => setActiveTab('personal')}
          >
            Información personal
          </button>
          <button
            type="button"
            className={`flex-1 py-4 px-6 text-center ${activeTab === 'complementary'
              ? 'bg-customLightYellow text-black font-semibold'
              : 'bg-customDarkYellow text-black font-semibold hover:bg-customMiddleYellow'
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
                  disabled={isEditing}
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
                  max={(() => {
                    const today = new Date();
                    const maxDate = new Date(today.getFullYear() - 15, today.getMonth(), today.getDate());
                    return maxDate.toISOString().split('T')[0];
                  })()}
                />
              </div>
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Foto de perfil
                </label>
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400">No image</span>
                    )}
                  </div>
                  {!isEditing && (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="w-full sm:w-auto"
                    />
                  )}
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
                  max={(() => {
                    const today = new Date();
                    const maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                    return maxDate.toISOString().split('T')[0];
                  })()}
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
                  max={(() => {
                    const today = new Date();
                    const maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                    return maxDate.toISOString().split('T')[0];
                  })()}
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
              <div className="col-span-1 sm:col-span-2 flex items-center">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center">
                    <label className="block text-sm font-medium text-gray-700 mb-2 mr-2">
                      Programa
                    </label>
                    <button
                      onClick={() => setIsDialogOpen(true)}
                      type="button"
                      className="p-1 rounded-full hover:bg-gray-200 focus:outline-none"
                    >
                      <span className="text-xl font-bold">+</span>
                    </button>
                  </div>
                  <ProgramSelector
                    selectedProgram={formData.program}
                    onProgramChange={handleProgramChange}
                  />
                </div>
              </div>

              {/* Responsabilidades */}
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Responsabilidades
                </label>
                <ResponsabilitiesSelector
                  selectedResponsabilities={formData.responsabilities}
                  onResponsabilitiesChange={handleResponsabilitiesChange}
                />
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
                <RoleSelector
                  selectedRoleGrantings={formData.role_granting_list}
                  onRoleGrantingsChange={handleRoleGrantingsChange}
                />
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
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

      <DialogAddProgram
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={(program) => {
          handleProgramChange(program);
          setIsDialogOpen(false);
        }}
      />
    </>
  );
} 