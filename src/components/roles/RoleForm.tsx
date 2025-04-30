import React, { useState, useEffect } from 'react';
import { Role, Access } from '@/types/models/GeneralModels';
import { roleService } from '@/services/roleService';
import { accessService } from '@/services/extras/accessService';
import { toast, Toaster } from 'react-hot-toast';
import { Combobox } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface FormData extends Omit<Role, 'id'> {
  id?: number;
}

const initialFormData: FormData = {
  name: '',
  is_active: true,
  accesses: []
};

interface RoleFormProps {
  initialData?: Role | null;
  isEditing?: boolean;
}

export default function RoleForm({ initialData, isEditing = false }: RoleFormProps) {
  const [formData, setFormData] = useState<FormData>(initialData || initialFormData);
  const [query, setQuery] = useState('');
  const [availableAccesses, setAvailableAccesses] = useState<Access[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    const searchAccesses = async () => {
      if (query.length < 3) {
        setAvailableAccesses([]);
        return;
      }

      setIsSearching(true);
      try {
        const results = await accessService.searchAccesses(query);
        const filteredResults = results.filter(access => 
          !formData.accesses.some(selectedAccess => selectedAccess.id === access.id)
        );
        setAvailableAccesses(filteredResults);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
        setAvailableAccesses([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchAccesses, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, formData.accesses]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRemoveAccess = (accessId: number) => {
    setFormData(prev => ({
      ...prev,
      accesses: prev.accesses.filter(a => a.id !== accessId)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const roleData = {
        name: formData.name.trim(),
        is_active: formData.is_active,
        accesses: formData.accesses.map(access => ({
          id: access.id,
          name: access.name
        }))
      };

      if (isEditing && formData.id) {
        await roleService.updateRole(formData.id, roleData);
        toast.success('Rol actualizado exitosamente');
      } else {
        await roleService.createRole(roleData);
        toast.success('Rol creado exitosamente');
      }
      
      window.location.href = '/roles';
    } catch (error) {
      console.error('Error saving role:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al guardar el rol';
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
            Nombre del Rol *
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
            />
            <span>Rol Activo</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Accesos
          </label>
          <div className="space-y-4">
            <Combobox value={null} onChange={(access: Access | null) => {
              if (access && !formData.accesses.some(a => a.id === access.id)) {
                setFormData(prev => ({
                  ...prev,
                  accesses: [...prev.accesses, access]
                }));
              }
            }}>
              <div className="relative">
                <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left border focus-within:border-orange-500">
                  <Combobox.Input
                    className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                    displayValue={() => ''}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)}
                    placeholder="Buscar acceso..."
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
                      Buscando accesos...
                    </div>
                  ) : availableAccesses.length === 0 && query !== '' ? (
                    <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                      {query.length < 3 ? 'Escriba al menos 3 caracteres para buscar' : 'No se encontraron accesos.'}
                    </div>
                  ) : (
                    availableAccesses.map((access) => (
                      <Combobox.Option
                        key={access.id}
                        value={access}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active ? 'bg-orange-100 text-orange-900' : 'text-gray-900'
                          }`
                        }
                      >
                        {({ selected, active }) => (
                          <>
                            <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                              {access.name}
                            </span>
                            {selected && (
                              <span
                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                  active ? 'text-orange-600' : 'text-orange-600'
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

            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {formData.accesses.map(access => (
                  <div
                    key={access.id}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                  >
                    <span>{access.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAccess(access.id)}
                      className="p-0.5 hover:bg-orange-200 rounded-full"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
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