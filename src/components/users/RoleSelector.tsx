import React, { useState, useEffect } from 'react';
import { Role, Permission, RoleGranting, Access } from '@/types/models/GeneralModels';
import { roleService } from '@/services/roleService';
import { Combobox } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { toast } from 'react-hot-toast';

interface RoleSelectorProps {
  selectedRoleGrantings: RoleGranting[];
  onRoleGrantingsChange: (roleGrantings: RoleGranting[]) => void;
}

interface ComboboxOptionRenderProps {
  selected: boolean;
  active: boolean;
}

export default function RoleSelector({ selectedRoleGrantings, onRoleGrantingsChange }: RoleSelectorProps) {
  const [query, setQuery] = useState('');
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  useEffect(() => {
    const searchRoles = async () => {
      if (query.length < 3) {
        setAvailableRoles([]);
        return;
      }

      setIsLoading(true);
      try {
        const roles = await roleService.searchRoles(query);
        setAvailableRoles(roles);
      } catch (error) {
        console.error('Error searching roles:', error);
        toast.error('Error al buscar roles');
        setAvailableRoles([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchRoles, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleAddRole = (role: Role) => {
    if (!selectedRoleGrantings.find(rg => rg.role.id === role.id)) {
      onRoleGrantingsChange([
        ...selectedRoleGrantings,
        {
          id: Date.now(),
          role,
          permissions: [] // Inicialmente sin permisos
        }
      ]);
      setSelectedRole(null);
      setQuery('');
    }
  };

  const handleRemoveRole = (roleGrantingId: number) => {
    onRoleGrantingsChange(selectedRoleGrantings.filter(rg => rg.id !== roleGrantingId));
  };

  const handleToggleAccess = (roleGrantingId: number, access: Access) => {
    onRoleGrantingsChange(
      selectedRoleGrantings.map(rg => {
        if (rg.id === roleGrantingId) {
          const hasAccess = rg.permissions.some(p => p.id === access.id);
          return {
            ...rg,
            permissions: hasAccess
              ? rg.permissions.filter(p => p.id !== access.id)
              : [...rg.permissions, {
                  id: access.id,
                  name: access.name,
                  description: access.name // Usamos el nombre como descripción temporal
                }]
          };
        }
        return rg;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Búsqueda de roles */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Buscar roles:</h4>
        <Combobox value={selectedRole} onChange={handleAddRole}>
          <div className="relative">
            <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left border focus-within:border-orange-500">
              <Combobox.Input
                className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                displayValue={(role: Role | null) => role?.name || ''}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)}
                placeholder="Buscar roles..."
              />
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </Combobox.Button>
            </div>
            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
              {isLoading ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                  Buscando roles...
                </div>
              ) : availableRoles.length === 0 && query !== '' ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                  {query.length < 3 ? 'Escriba al menos 3 caracteres para buscar' : 'No se encontraron roles.'}
                </div>
              ) : (
                availableRoles.map((role) => (
                  <Combobox.Option
                    key={role.id}
                    className={({ active }: { active: boolean }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-orange-100 text-orange-900' : 'text-gray-900'
                      }`
                    }
                    value={role}
                    disabled={selectedRoleGrantings.some(rg => rg.role.id === role.id)}
                  >
                    {({ selected, active }: ComboboxOptionRenderProps) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                          {role.name}
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
      </div>

      {/* Roles y permisos asignados */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Roles asignados:</h4>
        <div className="space-y-4">
          {selectedRoleGrantings.map(roleGranting => (
            <div key={roleGranting.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h5 className="font-medium">{roleGranting.role.name}</h5>
                <button
                  type="button"
                  onClick={() => handleRemoveRole(roleGranting.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Eliminar
                </button>
              </div>

              <div>
                <h6 className="text-sm font-medium text-gray-700 mb-2">Accesos:</h6>
                <div className="grid grid-cols-2 gap-2">
                  {roleGranting.role.accesses.map(access => (
                    <label
                      key={access.id}
                      className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={roleGranting.permissions.some(p => p.id === access.id)}
                        onChange={() => handleToggleAccess(roleGranting.id, access)}
                        className="form-checkbox h-4 w-4 text-orange-600"
                      />
                      <span className="text-sm">{access.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ))}
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