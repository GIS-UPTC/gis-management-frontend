import React, { useState, useEffect } from 'react';
import { Project, Cooperation, InCharge } from '@/types/models/project.models';
import { User } from '@/types/models/GeneralModels';

import { userService } from '@/services/userService';
import { toast, Toaster } from 'react-hot-toast';
import SearchBar from '@/components/ui/SearchBar';
import { projectService } from '@/services/projectService';

interface CooperationSectionProps {
  formData: Omit<Project, 'id'>;
  setFormData: React.Dispatch<React.SetStateAction<Omit<Project, 'id'>>>;
  onValidationChange?: (isValid: boolean) => void;
}

export default function CooperationSection({ formData, setFormData, onValidationChange }: CooperationSectionProps) {
  // Estados para búsqueda de usuarios del GIS
  const [gisUsers, setGisUsers] = useState<User[]>([]);
  const [isGisLoading, setIsGisLoading] = useState(false);

  // Estados para búsqueda de usuarios a cargo
  const [inChargeUsers, setInChargeUsers] = useState<InCharge[]>([]);
  const [isInChargeLoading, setIsInChargeLoading] = useState(false);

  // Estado para agregar nuevo usuario a cargo manualmente
  const [newInCharge, setNewInCharge] = useState<Partial<InCharge>>({
    first_name: '',
    last_name: '',
    dni: '',
    group_or_entity: ''
  });

  // Estado para el tipo de cooperación
  const [cooperationType, setCooperationType] = useState<'IN' | 'EX'>('IN');

  // Efecto para actualizar el estado de validación
  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(formData.cooperation_list.length > 0);
    }
  }, [formData.cooperation_list, onValidationChange]);

  // Búsqueda de usuarios del GIS
  const searchGisUsers = async (query: string) => {
    if (query.length < 3) return;

    try {
      setIsGisLoading(true);
      const results = await userService.searchUsersByName(query);
      setGisUsers(results);
    } catch {
      toast.error('Error al buscar usuarios del GIS');
    } finally {
      setIsGisLoading(false);
    }
  };

  // Búsqueda de usuarios a cargo
  const searchInChargeUsers = async (query: string) => {
    if (query.length < 3) return;

    try {
      setIsInChargeLoading(true);
      // Aquí deberías usar el servicio real para buscar usuarios a cargo
      // Por ahora, simulamos la respuesta con el formato correcto de InCharge
      const inChargeResults = await projectService.searchInCharges(query)
      
      setInChargeUsers(inChargeResults);
    } catch {
      toast.error('Error al buscar usuarios a cargo');
    } finally {
      setIsInChargeLoading(false);
    }
  };

  // Seleccionar usuario del GIS
  const handleGisUserSelect = (user: User) => {
    // Verificar si el usuario ya está en la lista de cooperaciones
    const isAlreadyAdded = formData.cooperation_list.some(
      cooperation => cooperation.cooperator?.id === user.id
    );

    if (isAlreadyAdded) {
      toast.error('Este usuario ya está en la lista de cooperaciones');
      return;
    }

    const newCooperationItem: Cooperation = {
      id: Date.now(),
      in_charge: null,
      cooperator: user,
      type: cooperationType,
      cooperator_id: user.id
    };

    setFormData(prev => ({
      ...prev,
      cooperation_list: [...prev.cooperation_list, newCooperationItem]
    }));

    // Limpiar resultados de búsqueda
    setGisUsers([]);
  };

  // Seleccionar usuario a cargo
  const handleInChargeUserSelect = (inCharge: InCharge) => {
    // Verificar si el usuario ya está en la lista de cooperaciones
    const isAlreadyAdded = formData.cooperation_list.some(
      cooperation => 
        (cooperation.in_charge && 
         cooperation.in_charge.first_name === inCharge.first_name && 
         cooperation.in_charge.last_name === inCharge.last_name)
    );

    if (isAlreadyAdded) {
      toast.error('Este usuario a cargo ya está en la lista de cooperaciones');
      return;
    }

    const newCooperationItem: Cooperation = {
      id: Date.now(),
      in_charge: inCharge,
      cooperator: null,
      type: cooperationType,
      cooperator_id: null
    };

    setFormData(prev => ({
      ...prev,
      cooperation_list: [...prev.cooperation_list, newCooperationItem]
    }));

    // Limpiar resultados de búsqueda
    setInChargeUsers([]);
  };

  // Cambios en el formulario de nuevo usuario a cargo
  const handleInChargeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewInCharge(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Agregar nuevo usuario a cargo
  const handleAddNewInCharge = () => {
    // Validar que los campos requeridos estén completos
    if (!newInCharge.first_name || !newInCharge.last_name || !newInCharge.dni || !newInCharge.group_or_entity) {
      toast.error('Todos los campos son obligatorios');
      return;
    }

    // Verificar si el usuario ya está en la lista de cooperaciones
    const isAlreadyAdded = formData.cooperation_list.some(
      cooperation => 
        (cooperation.in_charge && 
         cooperation.in_charge.first_name === newInCharge.first_name && 
         cooperation.in_charge.last_name === newInCharge.last_name && 
         cooperation.in_charge.dni === newInCharge.dni)
    );

    if (isAlreadyAdded) {
      toast.error('Este usuario a cargo ya está en la lista de cooperaciones');
      return;
    }

    const inCharge: InCharge = {
      id: Date.now(),
      first_name: newInCharge.first_name!,
      last_name: newInCharge.last_name!,
      dni: newInCharge.dni!,
      group_or_entity: newInCharge.group_or_entity!
    };

    const newCooperationItem: Cooperation = {
      id: Date.now(),
      in_charge: inCharge,
      cooperator: null,
      type: cooperationType,
      cooperator_id: null
    };

    setFormData(prev => ({
      ...prev,
      cooperation_list: [...prev.cooperation_list, newCooperationItem]
    }));

    // Resetear el formulario
    setNewInCharge({
      first_name: '',
      last_name: '',
      dni: '',
      group_or_entity: ''
    });
  };

  // Eliminar cooperación
  const handleRemoveCooperation = (id: number) => {
    setFormData(prev => ({
      ...prev,
      cooperation_list: prev.cooperation_list.filter(c => c.id !== id)
    }));
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-center" />
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold">Cooperaciones</h3>
        <span className="text-red-500">*</span>
        <span className="text-sm text-gray-500">(Seleccione una de las opciones)</span>
      </div>
      
      {/* Lista de cooperaciones existentes */}
      <div className="space-y-4">
        {formData.cooperation_list.map(cooperation => (
          <div key={cooperation.id} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                {cooperation.cooperator && (
                  <p className="font-medium">
                    Usuario GIS: {cooperation.cooperator.first_name} {cooperation.cooperator.surname}
                  </p>
                )}
                {cooperation.in_charge && (
                  <>
                    <p className="font-medium">
                      Responsable: {cooperation.in_charge.first_name} {cooperation.in_charge.last_name}
                    </p>
                    <p className="text-sm">
                      DNI: {cooperation.in_charge.dni}
                    </p>
                    <p className="text-sm">
                      Entidad/Grupo: {cooperation.in_charge.group_or_entity}
                    </p>
                  </>
                )}
                <p className="text-sm text-gray-500">
                  Tipo: {cooperation.type === 'IN' ? 'Interna' : 'Externa'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveCooperation(cooperation.id)}
                className="text-red-600 hover:text-red-800"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Tipo de cooperación */}
      <div className="p-4 bg-gray-50 rounded-lg mb-6">
        <h3 className="text-md font-medium mb-3">Tipo de Cooperación</h3>
        <select
          value={cooperationType}
          onChange={(e) => setCooperationType(e.target.value as "IN" | "EX")}
          className="w-full p-2 border rounded-lg"
        >
          <option value="IN">Cooperación Interna</option>
          <option value="EX">Cooperación Externa</option>
        </select>
      </div>

      {/* Sección de opciones para agregar cooperación */}
      {formData.cooperation_list.length === 0 && (
        <>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-yellow-700">
              <strong>Importante:</strong> Debe seleccionar al menos un cooperador usando cualquiera de las siguientes opciones:
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* OPCIÓN 1: Buscar usuario del GIS */}
            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <h4 className="font-medium text-blue-800 mb-3">Opción 1: Buscar usuario del GIS</h4>
              <p className="text-sm text-gray-600 mb-3">Busque y seleccione un usuario ya registrado en el sistema GIS.</p>
              <SearchBar 
                onSearch={searchGisUsers} 
                isLoading={isGisLoading} 
                placeholder="Buscar usuario del GIS..."
              />
              
              {gisUsers.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                  {gisUsers.map(user => {
                    const isAlreadyAdded = formData.cooperation_list.some(
                      cooperation => cooperation.cooperator?.id === user.id
                    );

                    return (
                      <div
                        key={user.id}
                        className={`flex items-center justify-between p-2 rounded-lg ${
                          isAlreadyAdded ? 'bg-gray-100 text-gray-400' : 'bg-white border border-gray-200'
                        }`}
                      >
                        <span>{user.first_name} {user.surname}</span>
                        {!isAlreadyAdded ? (
                          <button
                            type="button"
                            onClick={() => handleGisUserSelect(user)}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Seleccionar
                          </button>
                        ) : (
                          <span className="text-gray-400">Ya seleccionado</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            {/* OPCIÓN 2: Buscar persona a cargo */}
            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
              <h4 className="font-medium text-green-800 mb-3">Opción 2: Buscar persona a cargo</h4>
              <p className="text-sm text-gray-600 mb-3">Busque una persona a cargo que ya ha sido registrada previamente.</p>
              <SearchBar 
                onSearch={searchInChargeUsers} 
                isLoading={isInChargeLoading} 
                placeholder="Buscar persona a cargo..."
              />
              
              {inChargeUsers.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                  {inChargeUsers.map(inCharge => {
                    const isAlreadyAdded = formData.cooperation_list.some(
                      cooperation => 
                        (cooperation.in_charge && 
                        cooperation.in_charge.first_name === inCharge.first_name && 
                        cooperation.in_charge.last_name === inCharge.last_name)
                    );
                    
                    return (
                      <div
                        key={inCharge.id}
                        className={`flex items-center justify-between p-2 rounded-lg ${
                          isAlreadyAdded ? 'bg-gray-100 text-gray-400' : 'bg-white border border-gray-200'
                        }`}
                      >
                        <div>
                          <span className="block">{inCharge.first_name} {inCharge.last_name}</span>
                          <span className="block text-xs text-gray-500">
                            {inCharge.group_or_entity} - DNI: {inCharge.dni}
                          </span>
                        </div>
                        {!isAlreadyAdded ? (
                          <button
                            type="button"
                            onClick={() => handleInChargeUserSelect(inCharge)}
                            className="text-green-600 hover:text-green-800 font-medium"
                          >
                            Seleccionar
                          </button>
                        ) : (
                          <span className="text-gray-400">Ya seleccionado</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            {/* OPCIÓN 3: Agregar nueva persona a cargo */}
            <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
              <h4 className="font-medium text-purple-800 mb-3">Opción 3: Agregar nueva persona a cargo</h4>
              <p className="text-sm text-gray-600 mb-3">Registre manualmente los datos de una nueva persona a cargo.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={newInCharge.first_name || ''}
                    onChange={handleInChargeChange}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={newInCharge.last_name || ''}
                    onChange={handleInChargeChange}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    DNI *
                  </label>
                  <input
                    type="text"
                    name="dni"
                    value={newInCharge.dni || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        handleInChargeChange(e);
                      }
                    }}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Entidad/Grupo *
                  </label>
                  <input
                    type="text"
                    name="group_or_entity"
                    value={newInCharge.group_or_entity || ''}
                    onChange={handleInChargeChange}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddNewInCharge}
                  className="px-4 py-2 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 font-medium"
                >
                  Agregar Usuario a Cargo
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}