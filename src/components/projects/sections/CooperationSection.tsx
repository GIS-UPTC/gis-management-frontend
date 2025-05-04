import React, { useState } from 'react';
import { Project, Cooperation, InCharge } from '@/types/models/project.models';
import { User } from '@/types/models/GeneralModels';

import { userService } from '@/services/userService';
import { toast, Toaster } from 'react-hot-toast';
import SearchBar from '@/components/ui/SearchBar';
import { projectService } from '@/services/projectService';

interface CooperationSectionProps {
  formData: Omit<Project, 'id'>;
  setFormData: React.Dispatch<React.SetStateAction<Omit<Project, 'id'>>>;
}

export default function CooperationSection({ formData, setFormData }: CooperationSectionProps) {
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
      <h3 className="text-lg font-semibold mb-4">Cooperaciones</h3>
      
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
      
      {/* Sección de agregar nueva cooperación */}
      <div className="space-y-6 p-4 bg-orange-100 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Cooperación
          </label>
          <select
            value={cooperationType}
            onChange={(e) => setCooperationType(e.target.value as "IN" | "EX")}
            className="w-full p-2 border rounded-lg"
            required
          >
            <option value="IN">Cooperación Interna</option>
            <option value="EX">Cooperación Externa</option>
          </select>
        </div>
        
        {/* Subsección 1: Buscar usuario del GIS */}
        <div className="space-y-4">
          <h4 className="font-medium">Buscar usuario del GIS</h4>
          <SearchBar 
            onSearch={searchGisUsers} 
            isLoading={isGisLoading} 
            placeholder="Buscar usuario del GIS..."
          />
          
          {gisUsers.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {gisUsers.map(user => {
                const isAlreadyAdded = formData.cooperation_list.some(
                  cooperation => cooperation.cooperator?.id === user.id
                );

                return (
                  <div
                    key={user.id}
                    className={`flex items-center justify-between p-2 rounded-lg ${
                      isAlreadyAdded ? 'bg-gray-100 text-gray-400' : 'bg-gray-50'
                    }`}
                  >
                    <span>{user.first_name} {user.surname}</span>
                    {!isAlreadyAdded ? (
                      <button
                        type="button"
                        onClick={() => handleGisUserSelect(user)}
                        className="text-green-600 hover:text-green-800"
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
        
        {/* Subsección 2: Buscar usuario a cargo */}
        <div className="space-y-4">
          <h4 className="font-medium">Buscar persona a cargo</h4>
          <SearchBar 
            onSearch={searchInChargeUsers} 
            isLoading={isInChargeLoading} 
            placeholder="Buscar usuario a cargo..."
          />
          
          {inChargeUsers.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      isAlreadyAdded ? 'bg-gray-100 text-gray-400' : 'bg-gray-50'
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
                        className="text-green-600 hover:text-green-800"
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
        
        {/* Subsección 3: Agregar usuario a cargo */}
        <div className="space-y-4">
          <h4 className="font-medium">Agregar persona a cargo</h4>
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
                required
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
                required
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
                required
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
                required
              />
            </div>
            <button
              type="button"
              onClick={handleAddNewInCharge}
              className="px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200"
            >
              Agregar Usuario a Cargo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}