import React, { useState, useEffect } from 'react';
import { Role, Access } from '@/types/models/GeneralModels';
import { roleService } from '@/services/roleService';
import { accessService } from '@/services/extras/accessService';
import { toast, Toaster } from 'react-hot-toast';
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
  const [allAccesses, setAllAccesses] = useState<Access[]>([]);
  const [filteredAccesses, setFilteredAccesses] = useState<Access[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar todos los accesos al montar el componente
  useEffect(() => {
    const fetchAllAccesses = async () => {
      setIsLoading(true);
      try {
        // Asumiendo que accessService tiene un método fetchAccesses
        const accesses = await accessService.fetchAccesses(' ');
        setAllAccesses(accesses);
        setFilteredAccesses(accesses);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllAccesses();
  }, []);

  // Actualizar el formulario cuando cambia initialData
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  // Filtrar accesos según el texto de búsqueda
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredAccesses(allAccesses);
    } else {
      const filtered = allAccesses.filter(access => 
        access.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredAccesses(filtered);
    }
  }, [searchQuery, allAccesses]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddAccess = (access: Access) => {
    if (!formData.accesses.some(a => a.id === access.id)) {
      setFormData(prev => ({
        ...prev,
        accesses: [...prev.accesses, access]
      }));
    }
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

  // Obtener accesos que no han sido seleccionados aún
  const getAvailableAccesses = () => {
    return filteredAccesses.filter(access => 
      !formData.accesses.some(selectedAccess => selectedAccess.id === access.id)
    );
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Privilegios
          </label>
          
          {/* Sección de privilegios seleccionados */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Privilegios seleccionados:</h3>
            <div className="flex flex-wrap gap-2">
              {formData.accesses.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No se han seleccionado privilegios</p>
              ) : (
                formData.accesses.map(access => (
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
                ))
              )}
            </div>
          </div>

          {/* Campo de búsqueda y lista de accesos disponibles */}
          <div className="border rounded-lg bg-white p-4">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Buscar privilegios..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            {isLoading ? (
              <div className="py-4 text-center text-gray-500">
                Cargando privilegios...
              </div>
            ) : (
              <div className="max-h-60 overflow-y-auto">
                {getAvailableAccesses().length === 0 ? (
                  <div className="py-4 text-center text-gray-500">
                    {allAccesses.length === 0 
                      ? "No hay privilegios disponibles" 
                      : "No se encontraron privilegios que coincidan con la búsqueda"}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {getAvailableAccesses().map(access => (
                      <div
                        key={access.id}
                        className="flex items-center justify-between p-2 hover:bg-orange-50 rounded cursor-pointer"
                        onClick={() => handleAddAccess(access)}
                      >
                        <span className="text-sm">{access.name}</span>
                        <button
                          type="button"
                          className="p-1 text-orange-600 hover:bg-orange-100 rounded-full"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
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

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path
        fillRule="evenodd"
        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
        clipRule="evenodd"
      />
    </svg>
  );
}