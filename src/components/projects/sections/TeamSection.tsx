import React, { useState } from 'react';
import { Project, Participation } from '@/types/models/project.models';
import { ResearchLine } from '@/types/models/GeneralModels';
import { User } from '@/types/models/GeneralModels';
import { researchLineService } from '@/services/researchLineService';
import { userService } from '@/services/userService';
import { toast, Toaster } from 'react-hot-toast';
import { Combobox } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { formatUserFullName } from '@/utils/stringUtils';

interface TeamSectionProps {
  formData: Omit<Project, 'id'>;
  setFormData: React.Dispatch<React.SetStateAction<Omit<Project, 'id'>>>;
}

export default function TeamSection({ formData, setFormData }: TeamSectionProps) {
  const [researchLines, setResearchLines] = useState<ResearchLine[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [newParticipation, setNewParticipation] = useState<Partial<Participation>>({
    start_date: '',
    end_date: '',
    role: 'JI',
    responsibility: ''
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResearchLineOpen, setIsResearchLineOpen] = useState(false);
  const [isUsersDropdownOpen, setIsUsersDropdownOpen] = useState(false);

  const fetchResearchLines = async () => {
    try {
      setIsLoading(true);
      const results = await researchLineService.fetchResearchLines(' ');
      setResearchLines(results);
    } catch {
      toast.error('Error al cargar líneas de investigación');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async (query: string = '') => {
    try {
      setIsLoading(true);
      let results: User[];
      
      if (query.trim() !== '') {
        results = await userService.searchUsersByName(query);
      } else {
        // Si no hay texto de búsqueda, usar el método original
        results = await userService.fetchUsers(' ');
      }
      
      // Filtrar para no mostrar usuarios que ya están en el equipo
      const filteredUsers = results.filter(user => 
        !formData.participations.some(p => p.user.id === user.id)
      );
      setUsers(filteredUsers);
    } catch {
      toast.error('Error al cargar usuarios');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectResearchLine = (line: ResearchLine) => {
    if (!line) return;
    
    setFormData(prev => ({
      ...prev,
      research_line: line,
      research_line_id: line.id
    }));
    setIsResearchLineOpen(false);
  };

  const handleAddParticipation = () => {
    if (selectedUser && newParticipation.start_date && newParticipation.role && newParticipation.responsibility) {
      const participation: Participation = {
        id: Date.now(),
        user: selectedUser,
        start_date: newParticipation.start_date,
        end_date: newParticipation.end_date || '',
        role: newParticipation.role,
        responsibility: newParticipation.responsibility,
        user_id: selectedUser.id
      };

      setFormData(prev => ({
        ...prev,
        participations: [...prev.participations, participation]
      }));

      // Reset form state
      setSelectedUser(null);
      setUsers([]);
      setNewParticipation({
        start_date: '',
        end_date: '',
        role: 'JI',
        responsibility: ''
      });
    }
  };

  const handleRemoveParticipation = (id: number) => {
    setFormData(prev => ({
      ...prev,
      participations: prev.participations.filter(p => p.id !== id)
    }));
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-center" />
      {/* Research Line Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Línea de Investigación</h3>
        <div className="space-y-4">
          <Combobox value={formData.research_line || null} onChange={handleSelectResearchLine}>
            <div className="relative">
              <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left border focus-within:border-orange-500">
                <Combobox.Button
                  className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 flex justify-between items-center"
                  onClick={() => {
                    setIsResearchLineOpen(true);
                    fetchResearchLines();
                  }}
                >
                  <span className="text-gray-900">
                  Seleccionar línea de investigación...
                  </span>
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </Combobox.Button>
              </div>

              {isResearchLineOpen && (
                <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                  {isLoading ? (
                    <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                      Cargando líneas de investigación...
                    </div>
                  ) : researchLines.length === 0 ? (
                    <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                      No hay líneas de investigación disponibles
                    </div>
                  ) : (
                    researchLines.map((line) => (
                      <Combobox.Option
                        key={line.id}
                        value={line}
                        className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-orange-100 text-orange-900' : 'text-gray-900'}`}
                      >
                        {({ selected }) => (
                          <>
                            <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                              {line.name}
                            </span>
                            {selected && (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-orange-600">
                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                              </span>
                            )}
                          </>
                        )}
                      </Combobox.Option>
                    ))
                  )}
                </Combobox.Options>
              )}
            </div>
          </Combobox>

          {formData.research_line && (
            <div className="p-4 bg-orange-100 rounded-lg">
              <p className="font-medium">Línea seleccionada:</p>
              <p>{formData.research_line.name}</p>
            </div>
          )}
        </div>
      </div>

      {/* Team Members Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Miembros del Equipo *</h3>
        <div className="space-y-4">
          {formData.participations.map(participation => (
            <div key={participation.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">
                    {formatUserFullName(participation.user)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Rol: {participation.role === 'IP' ? 'Investigador Principal' :
                          participation.role === 'CI' ? 'Co-Investigador' :
                          participation.role === 'JI' ? 'Joven Investigador' :
                          participation.role === 'SE' ? 'Estudiante' :
                          'Externo'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Responsabilidad: {participation.responsibility}
                  </p>
                  <p className="text-sm text-gray-500">
                    Período: {participation.start_date} - {participation.end_date || 'Presente'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveParticipation(participation.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Seleccionar miembro:</h4>
              <Combobox value={null as unknown as User} onChange={(user: User) => {
                if (user && !formData.participations.some(p => p.user.id === user.id)) {
                  setSelectedUser(user);
                  setIsUsersDropdownOpen(false);
                }
              }}>
                <div className="relative">
                  <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left border focus-within:border-orange-500">
                    <Combobox.Button
                      className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 flex justify-between items-center"
                      onClick={() => {
                        setIsUsersDropdownOpen(true);
                        fetchUsers('');
                      }}
                    >
                      <span className="text-gray-900">
                        Seleccionar miembro del equipo...
                      </span>
                      <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </Combobox.Button>
                  </div>

                  {isUsersDropdownOpen && (
                    <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                      {isLoading ? (
                        <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                          Cargando usuarios...
                        </div>
                      ) : users.length === 0 ? (
                        <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                          No hay usuarios disponibles para agregar
                        </div>
                      ) : (
                        users.map((user) => {
                          const isAlreadyMember = formData.participations.some(
                            p => p.user.id === user.id
                          );
                          
                          return (
                            <Combobox.Option
                              key={user.id}
                              value={user}
                              className={({ active }) => 
                                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                  isAlreadyMember 
                                    ? 'bg-gray-100 text-gray-400' 
                                    : active 
                                      ? 'bg-orange-100 text-orange-900' 
                                      : 'text-gray-900'
                                }`
                              }
                              disabled={isAlreadyMember}
                            >
                              {({ selected }) => (
                                <>
                                  <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                    {formatUserFullName(user)}
                                  </span>
                                  {selected && !isAlreadyMember && (
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-orange-600">
                                      <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                    </span>
                                  )}
                                  {isAlreadyMember && (
                                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                                      Ya en el equipo
                                    </span>
                                  )}
                                </>
                              )}
                            </Combobox.Option>
                          );
                        })
                      )}
                    </Combobox.Options>
                  )}
                </div>
              </Combobox>
            </div>

            {selectedUser && (
              <div className="space-y-4 p-4 bg-orange-100 rounded-lg">
                <p className="font-medium">Usuario seleccionado: {formatUserFullName(selectedUser)}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de Inicio *
                    </label>
                    <input
                      type="date"
                      value={newParticipation.start_date}
                      onChange={(e) => setNewParticipation(prev => ({ ...prev, start_date: e.target.value }))}
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
                      Fecha de Fin
                    </label>
                    <input
                      type="date"
                      value={newParticipation.end_date}
                      onChange={(e) => setNewParticipation(prev => ({ ...prev, end_date: e.target.value }))}
                      className="w-full p-2 border rounded-lg"
                      max={(() => {
                        const today = new Date();
                        const maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                        return maxDate.toISOString().split('T')[0];
                      })()}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rol *
                    </label>
                    <select
                      value={newParticipation.role}
                      onChange={(e) => setNewParticipation(prev => ({ ...prev, role: e.target.value as "JI" | "CI" | "IP" | "SE" | "EM" }))}
                      className="w-full p-2 border rounded-lg"
                      required
                    >
                      <option value="IP">Investigador Principal</option>
                      <option value="CI">Co-Investigador</option>
                      <option value="JI">Joven Investigador</option>
                      <option value="SE">Estudiante</option>
                      <option value="EM">Externo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Responsabilidad *
                    </label>
                    <input
                      type="text"
                      value={newParticipation.responsibility}
                      onChange={(e) => setNewParticipation(prev => ({ ...prev, responsibility: e.target.value }))}
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAddParticipation}
                  className="px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200"
                >
                  Agregar al Equipo
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}