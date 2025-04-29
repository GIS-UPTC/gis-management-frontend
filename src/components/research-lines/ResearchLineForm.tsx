import React, { useState, useEffect } from 'react';
import { ResearchLine } from '@/types/models/GeneralModels';
import { User } from '@/types/models/GeneralModels';
import { researchLineService } from '@/services/researchLineService';
import { userService } from '@/services/userService';
import { toast, Toaster } from 'react-hot-toast';
import { Combobox } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';

interface FormData extends Omit<ResearchLine, 'id'> {
  id?: number;
}

const initialFormData: FormData = {
  name: '',
  is_active: true,
  coordinator: {} as User
};

interface ResearchLineFormProps {
  initialData?: ResearchLine | null;
  isEditing?: boolean;
  withInactives: boolean;
  handleWithInactivesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ResearchLineForm({
  initialData,
  isEditing = false,
  withInactives,
  handleWithInactivesChange
}: ResearchLineFormProps) {
  const [formData, setFormData] = useState<FormData>(initialData || initialFormData);
  const [query, setQuery] = useState('');
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    const searchUsers = async () => {
      if (query.length < 3) {
        setAvailableUsers([]);
        return;
      }

      setIsSearching(true);
      try {
        const results = await userService.searchUsersByName(query);
        setAvailableUsers(results);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
        setAvailableUsers([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const formatUserFullName = (user: User) => {
    const firstName = user.first_name || '';
    const otherName = user.other_name || '';
    const surname = user.surname || '';
    const otherSurname = user.other_surname || '';

    return `${firstName} ${otherName} ${surname} ${otherSurname}`.replace(/\s+/g, ' ').trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const researchLineData = {
        name: formData.name.trim(),
        is_active: formData.is_active,
        coordinator: formData.coordinator
      };

      if (isEditing && formData.id) {
        await researchLineService.updateResearchLine(formData.id, researchLineData);
        toast.success('Línea de investigación actualizada exitosamente');
      } else {
        await researchLineService.createResearchLine(researchLineData);
        toast.success('Línea de investigación creada exitosamente');
      }

      window.location.href = '/lineas';
    } catch (error) {
      console.error('Error saving research line:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al guardar la línea de investigación';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-customLightYellow rounded-lg shadow max-w-4xl mx-auto p-6">
      <Toaster position="top-center" />
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre de la Línea de Investigación *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleInputChange}
              className="form-checkbox h-4 w-4 text-orange-600"
              disabled={isEditing}
            />
            <span>Línea de Investigación Activa</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Coordinador *
          </label>

          {/* Nuevo toggle para mostrar inactivos */}
          <label className="flex items-center space-x-2 mb-3">
            <input
              type="checkbox"
              checked={withInactives}
              onChange={handleWithInactivesChange}
              className="form-checkbox h-4 w-4 text-orange-600"
            />
            <span className="text-sm text-gray-700">Mostrar inactivos</span>
          </label>

          <div className="space-y-4">
            <Combobox
              value={formData.coordinator}
              onChange={(user: User) => {
                setFormData(prev => ({
                  ...prev,
                  coordinator: user
                }));
              }}
            >
              <div className="relative">
                <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left border focus-within:border-orange-500">
                  <Combobox.Input
                    className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                    displayValue={(user: User) => user.id ? formatUserFullName(user) : ''}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)}
                    placeholder="Buscar coordinador..."
                  />
                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </Combobox.Button>
                </div>
                <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                  {isSearching ? (
                    <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                      Buscando usuarios...
                    </div>
                  ) : availableUsers.length === 0 && query !== '' ? (
                    <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                      {query.length < 3 ? 'Escriba al menos 3 caracteres para buscar' : 'No se encontraron usuarios.'}
                    </div>
                  ) : (
                    availableUsers.map((user) => (
                      <Combobox.Option
                        key={user.id}
                        value={user}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-orange-100 text-orange-900' : 'text-gray-900'
                          }`
                        }
                      >
                        {({ selected, active }) => (
                          <>
                            <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                              {formatUserFullName(user)}
                            </span>
                            {selected && (
                              <span
                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-orange-600' : 'text-orange-600'
                                  }`}
                              >
                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                              </span>
                            )}
                          </>
                        )}
                      </Combobox.Option>
                    ))
                  )}
                </Combobox.Options>
              </div>
            </Combobox>
          </div>
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