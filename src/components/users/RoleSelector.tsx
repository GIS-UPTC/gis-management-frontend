import React, { useState, useEffect } from 'react';
import { Role, Permission, RoleGranting } from '@/types/models/GeneralModels';
import { roleService, RoleServiceError } from '@/services/roleService';
import { Combobox } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { toast, Toaster } from 'react-hot-toast';
import { permissionService } from '@/services/extras/permissionsService';

interface RoleSelectorProps {
  selectedRoleGrantings: RoleGranting[];
  onRoleGrantingsChange: (roleGrantings: RoleGranting[]) => void;
}

interface ComboboxOptionRenderProps {
  selected: boolean;
  active: boolean;
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
  const [permissionQuery, setPermissionQuery] = useState('');
  const [availablePermissions, setAvailablePermissions] = useState<Permission[]>([]);
  const [isPermissionLoading, setIsPermissionLoading] = useState(false);

  useEffect(() => {
    const searchPermissions = async () => {
      if (!permissionQuery || permissionQuery.length < 3) {
        setAvailablePermissions([]);
        return;
      }

      setIsPermissionLoading(true);
      try {
        const permissions = await permissionService.searchPermissions(permissionQuery);
        setAvailablePermissions(permissions.filter(p =>
          !roleGranting.permissions.some(existing => existing.id === p.id)
        ));
      } catch (error) {
        setAvailablePermissions([]);
      } finally {
        setIsPermissionLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchPermissions, 300);
    return () => clearTimeout(debounceTimer);
  }, [permissionQuery, roleGranting.permissions]);

  const handleAddPermission = (permission: Permission) => {
    if (!permission) return;
    onPermissionsChange([...roleGranting.permissions, permission]);
    setPermissionQuery('');
  };

  const handleRemovePermission = (permissionId: number) => {
    onPermissionsChange(roleGranting.permissions.filter(p => p.id !== permissionId));
  };

  return (
    <div className="border rounded-lg p-4">
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

      <div className="mb-4">
        <h6 className="text-sm font-medium text-gray-700 mb-2">Agregar permisos:</h6>
        <Combobox value={null as unknown as Permission} onChange={handleAddPermission}>
          <div className="relative">
            <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left border focus-within:border-orange-500">
              <Combobox.Input
                className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                placeholder="Buscar permisos..."
                onChange={(e) => setPermissionQuery(e.target.value)}
                value={permissionQuery}
              />
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </Combobox.Button>
            </div>

            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
              {isPermissionLoading ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                  Buscando permisos...
                </div>
              ) : availablePermissions.length === 0 && permissionQuery !== '' ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                  {permissionQuery.length < 3 ? 'Escriba al menos 3 caracteres' : 'No se encontraron permisos'}
                </div>
              ) : (
                availablePermissions.map((permission) => (
                  <Combobox.Option
                    key={permission.id}
                    value={permission}
                    className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-orange-100 text-orange-900' : 'text-gray-900'
                      }`}
                  >
                    {({ selected }) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                          {permission.name}
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
          </div>
        </Combobox>
      </div>

      <div className="space-y-2">
        {roleGranting.permissions.map(permission => (
          <div key={permission.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span className="text-sm">{permission.name}</span>
            <button
              type="button"
              onClick={() => handleRemovePermission(permission.id)}
              className="text-red-600 hover:text-red-800"
            >
              Eliminar
            </button>
          </div>
        ))}
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