import React, { useState, useEffect } from 'react';
import { Project, Cooperation, InCharge } from '@/types/models/project.models';
import { User } from '@/types/models/GeneralModels';
import { projectService } from '@/services/projectService';
import { userService } from '@/services/userService';
import { toast, Toaster } from 'react-hot-toast';

interface CooperationSectionProps {
  formData: Omit<Project, 'id'>;
  setFormData: React.Dispatch<React.SetStateAction<Omit<Project, 'id'>>>;
}

export default function CooperationSection({ formData, setFormData }: CooperationSectionProps) {
  const [searchUser, setSearchUser] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [newCooperation, setNewCooperation] = useState<Partial<Cooperation>>({
    type: 'IN',
    in_charge: null,
    cooperator: null,
    cooperator_id: null
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const searchUsers = async (query: string) => {
    if (query.length < 3) return;

    try {
      setIsLoading(true);
      const results = await userService.searchUsersByName(query);
      setUsers(results);
    } catch (error) {
      toast.error('Error al buscar usuarios');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchUser) {
        searchUsers(searchUser);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchUser]);

  const handleUserSelect = (user: User) => {
    if (newCooperation.type === 'IN') {
      // Verificar si el usuario ya es coordinador en alguna cooperación
      const isAlreadyCoordinator = formData.cooperation_list.some(
        cooperation => cooperation.type === 'IN' && cooperation.cooperator?.id === user.id
      );

      if (isAlreadyCoordinator) {
        toast.error('Este usuario ya es coordinador en una cooperación interna');
        return;
      }

      const newCooperationItem: Cooperation = {
        id: Date.now(),
        in_charge: null,
        cooperator: user,
        type: 'IN',
        cooperator_id: user.id
      };

      setFormData(prev => ({
        ...prev,
        cooperation_list: [...prev.cooperation_list, newCooperationItem]
      }));

      // Reset form state
      setSelectedUser(null);
      setSearchUser('');
      setUsers([]);
      setNewCooperation({
        type: 'IN',
        in_charge: null,
        cooperator: null,
        cooperator_id: null
      });
    } else {
      setSelectedUser(user);
    }
  };

  const handleAddCooperation = () => {
    if (newCooperation.type === 'IN' && selectedUser) {
      const newCooperationItem: Cooperation = {
        id: Date.now(),
        in_charge: null,
        cooperator: selectedUser,
        type: 'IN',
        cooperator_id: selectedUser.id
      };

      setFormData(prev => ({
        ...prev,
        cooperation_list: [...prev.cooperation_list, newCooperationItem]
      }));

      // Reset form state
      setSelectedUser(null);
      setSearchUser('');
      setUsers([]);
      setNewCooperation({
        type: 'IN',
        in_charge: null,
        cooperator: null,
        cooperator_id: null
      });
    } else if (newCooperation.type === 'EX' && newCooperation.in_charge) {
      const inCharge: InCharge = {
        id: Date.now(),
        first_name: newCooperation.in_charge.first_name,
        last_name: newCooperation.in_charge.last_name,
        dni: newCooperation.in_charge.dni,
        group_or_entity: newCooperation.in_charge.group_or_entity
      };

      const newCooperationItem: Cooperation = {
        id: Date.now(),
        in_charge: inCharge,
        cooperator: null,
        type: 'EX',
        cooperator_id: null
      };

      setFormData(prev => ({
        ...prev,
        cooperation_list: [...prev.cooperation_list, newCooperationItem]
      }));

      // Reset form state
      setNewCooperation({
        type: 'EX',
        in_charge: null,
        cooperator: null,
        cooperator_id: null
      });
    }
  };

  const handleRemoveCooperation = (id: number) => {
    setFormData(prev => ({
      ...prev,
      cooperation_list: prev.cooperation_list.filter(c => c.id !== id)
    }));
  };

  const handleInChargeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCooperation(prev => ({
      ...prev,
      in_charge: {
        ...prev.in_charge!,
        [name]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-center" />
      <h3 className="text-lg font-semibold mb-4">Cooperaciones</h3>
      <div className="space-y-4">
        {formData.cooperation_list.map(cooperation => (
          <div key={cooperation.id} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">
                  {cooperation.type === 'IN' ? (
                    <>
                      Cooperador: {cooperation.cooperator?.first_name} {cooperation.cooperator?.surname}
                    </>
                  ) : (
                    <>
                      Responsable: {cooperation.in_charge?.first_name} {cooperation.in_charge?.last_name}
                      <br />
                      Entidad/Grupo: {cooperation.in_charge?.group_or_entity}
                    </>
                  )}
                </p>
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

        <div className="space-y-4 p-4 bg-orange-100 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Cooperación
            </label>
            <select
              value={newCooperation.type}
              onChange={(e) => setNewCooperation(prev => ({ ...prev, type: e.target.value as "IN" | "EX" }))}
              className="w-full p-2 border rounded-lg"
              required
            >
              <option value="IN">Cooperación Interno</option>
              <option value="EX">Cooperación Externo</option>
            </select>
          </div>

          {newCooperation.type === 'IN' ? (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <input
                  type="text"
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  placeholder="Buscar usuario interno..."
                  className="flex-1 p-2 border rounded-lg"
                />
                {isLoading && (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                  </div>
                )}
              </div>

              {users.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {users.map(user => {
                    const isAlreadyCoordinator = formData.cooperation_list.some(
                      cooperation => cooperation.type === 'IN' && cooperation.cooperator?.id === user.id
                    );

                    return (
                      <div
                        key={user.id}
                        className={`flex items-center justify-between p-2 rounded-lg ${isAlreadyCoordinator ? 'bg-gray-100 text-gray-400' : 'bg-gray-50'
                          }`}
                      >
                        <span>{user.first_name} {user.surname}</span>
                        {!isAlreadyCoordinator ? (
                          <button
                            type="button"
                            onClick={() => handleUserSelect(user)}
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
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={newCooperation.in_charge?.first_name || ''}
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
                  value={newCooperation.in_charge?.last_name || ''}
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
                  value={newCooperation.in_charge?.dni || ''}
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
                  value={newCooperation.in_charge?.group_or_entity || ''}
                  onChange={handleInChargeChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <button
                type="button"
                onClick={handleAddCooperation}
                className="px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200"
              >
                Agregar Cooperación
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 