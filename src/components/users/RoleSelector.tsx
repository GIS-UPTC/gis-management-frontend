import React, { useState, useEffect } from 'react';
import { Role, Permission, RoleGranting } from '@/types/models/GeneralModels';
import { roleService, RoleServiceError } from '@/services/roleService';
import { Combobox } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { toast, Toaster } from 'react-hot-toast';
import { permissionService } from '@/services/extras/permissionsService';

interface RoleSelectorProps {
  selectedRoleGrantings: RoleGranting[];
  onRoleGrantingsChange: (roleGrantings: RoleGranting[]) => void;
}

export default function RoleSelector({ selectedRoleGrantings, onRoleGrantingsChange }: RoleSelectorProps) {
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [isRoleLoading, setIsRoleLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const loadRoles = async () => {
    setIsRoleLoading(true);
    try {
      const roles = await roleService.fetchRoles(' ');
      setAvailableRoles(roles.filter(role =>
        !selectedRoleGrantings.some(rg => rg.role.id === role.id)
      ));
    } catch (error) {
      handleServiceError(error);
      setAvailableRoles([]);
    } finally {
      setIsRoleLoading(false);
    }
  };

  const handleServiceError = (error: unknown) => {
    if (error instanceof RoleServiceError) {
      toast.error(error.message);
    } else {
      toast.error('Ocurrió un error inesperado. Por favor, intente nuevamente.');
    }
  };

  const handleAddRole = (role: Role) => {
    if (!role || !role.name) {
      toast.error('Por favor seleccione un rol válido');
      return;
    }

    if (!selectedRoleGrantings.some(rg => rg.role.id === role.id)) {
      const newRoleGranting: RoleGranting = {
        id: Date.now(),
        role,
        permissions: []
      };
      onRoleGrantingsChange([...selectedRoleGrantings, newRoleGranting]);
      setIsOpen(false);
    }
  };

  const handleRemoveRole = (roleGrantingId: number) => {
    onRoleGrantingsChange(selectedRoleGrantings.filter(rg => rg.id !== roleGrantingId));
  };

  const updateRolePermissions = (roleId: number, permissions: Permission[]) => {
    onRoleGrantingsChange(selectedRoleGrantings.map(rg =>
      rg.id === roleId ? { ...rg, permissions } : rg
    ));
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-center" />
      {/* Selector de roles */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Seleccionar rol:</h4>
        <Combobox value={null as unknown as Role} onChange={handleAddRole}>
          <div className="relative">
            <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left border focus-within:border-orange-500">
              <Combobox.Button
                className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 flex justify-between items-center"
                onClick={() => {
                  setIsOpen(true);
                  loadRoles();
                }}
              >
                <span className="block truncate">Seleccionar un rol...</span>
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </Combobox.Button>
            </div>

            {isOpen && (
              <Combobox.Options className="absolute bottom-full mb-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                {isRoleLoading ? (
                  <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                    Cargando roles...
                  </div>
                ) : availableRoles.length === 0 ? (
                  <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                    No hay roles disponibles
                  </div>
                ) : (
                  availableRoles.map((role) => (
                    <Combobox.Option
                      key={role.id}
                      value={role}
                      className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-orange-100 text-orange-900' : 'text-gray-900'}`}
                    >
                      {({ selected }) => (
                        <>
                          <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                            {role.name}
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
      </div>

      {/* Roles y permisos seleccionados */}
      {selectedRoleGrantings.map(roleGranting => (
        <RolePermissionsEditor
          key={roleGranting.id}
          roleGranting={roleGranting}
          onPermissionsChange={(permissions) => updateRolePermissions(roleGranting.id, permissions)}
          onRemove={() => handleRemoveRole(roleGranting.id)}
        />
      ))}
    </div>
  );
}

const RolePermissionsEditor = ({ roleGranting, onPermissionsChange, onRemove }: {
  roleGranting: RoleGranting;
  onPermissionsChange: (permissions: Permission[]) => void;
  onRemove: () => void;
}) => {
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [filteredPermissions, setFilteredPermissions] = useState<Permission[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Cargar todos los permisos una vez al montar el componente
  useEffect(() => {
    const fetchAllPermissions = async () => {
      setIsLoading(true);
      try {
        // Asumiendo que permissionService tiene un método fetchPermissions
        const permissions = await permissionService.fetchPermissions(' ');
        setAllPermissions(permissions);
        setFilteredPermissions(permissions.filter(p =>
          !roleGranting.permissions.some(existing => existing.id === p.id)
        ));
      } catch {
        toast.error('Error al cargar permisos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllPermissions();
  }, [roleGranting.id]); // Cargar permisos cuando cambia el roleGranting

  // Filtrar permisos basado en la búsqueda
  useEffect(() => {
    if (searchQuery.trim() === '') {
      // Mostrar todos los permisos disponibles que no han sido seleccionados
      setFilteredPermissions(allPermissions.filter(p =>
        !roleGranting.permissions.some(existing => existing.id === p.id)
      ));
    } else {
      // Filtrar por texto de búsqueda
      setFilteredPermissions(allPermissions.filter(p =>
        !roleGranting.permissions.some(existing => existing.id === p.id) &&
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      ));
    }
  }, [searchQuery, allPermissions, roleGranting.permissions]);

  const handleAddPermission = (permission: Permission) => {
    if (!permission) return;
    onPermissionsChange([...roleGranting.permissions, permission]);
  };

  const handleRemovePermission = (permissionId: number) => {
    onPermissionsChange(roleGranting.permissions.filter(p => p.id !== permissionId));
  };

  return (
    <div className="border rounded-lg p-4">
      <Toaster position="top-center" />
      <div className="flex items-center justify-between mb-4">
        <h5 className="font-medium">{roleGranting.role?.name || 'Rol sin nombre'}</h5>
        <button
          type="button"
          onClick={onRemove}
          className="text-red-600 hover:text-red-800"
        >
          Eliminar rol
        </button>
      </div>

      {/* Permisos seleccionados */}
      <div className="mb-4">
        <h6 className="text-sm font-medium text-gray-700 mb-2">Permisos seleccionados:</h6>
        <div className="space-y-2">
          {roleGranting.permissions.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No se han seleccionado permisos</p>
          ) : (
            roleGranting.permissions.map(permission => (
              <div key={permission.id} className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                <span>{permission.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemovePermission(permission.id)}
                  className="p-0.5 hover:bg-orange-200 rounded-full"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Selector y buscador de permisos */}
      <div className="border rounded-lg p-4 bg-white">
        <h6 className="text-sm font-medium text-gray-700 mb-2">Agregar permisos:</h6>
        
        {/* Campo de búsqueda */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar permisos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* Lista de permisos disponibles */}
        {isLoading ? (
          <div className="py-4 text-center text-gray-500">
            Cargando permisos...
          </div>
        ) : (
          <div className="max-h-60 overflow-y-auto">
            {filteredPermissions.length === 0 ? (
              <div className="py-4 text-center text-gray-500">
                {allPermissions.length === 0 
                  ? "No hay permisos disponibles" 
                  : "No se encontraron permisos que coincidan con la búsqueda"}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {filteredPermissions.map(permission => (
                  <div
                    key={permission.id}
                    className="flex items-center justify-between p-2 hover:bg-orange-50 rounded cursor-pointer"
                    onClick={() => handleAddPermission(permission)}
                  >
                    <span className="text-sm">{permission.name}</span>
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
  );
};

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