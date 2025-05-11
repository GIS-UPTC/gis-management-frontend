import React from 'react';
import { useRouter } from 'next/navigation';
import { capitalizeFirstLetter, formatUserFullName } from '../../utils/stringUtils';
import { User } from '@/types/models/GeneralModels';
import { userService } from '@/services/userService';

interface UserTableProps {
  users: User[];
}

export default function UserTable({ users }: UserTableProps) {
  const router = useRouter();

  const handleRowClick = (user: User) => {
    const fullName = `${user.first_name}${user.other_name ? ` ${user.other_name}` : ''} ${user.surname}${user.other_surname ? ` ${user.other_surname}` : ''}`;
    const encodedName = encodeURIComponent(fullName.trim());
    const encodedDni = encodeURIComponent(user.dni);
    router.push(`/usuarios/${encodedName}?dni=${encodedDni}`);
  };

  const handleChangeStatus = async (user: User, e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que se active el click de la fila
    
    try {
      await userService.changeIsActiveUser(user.id);
      window.location.reload();
      
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cambiar el estado');
    }
  };


  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-yellow-200">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Nombre Completo</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Correo</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">DNI</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Roles</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Estado</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Cambiar Estado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.map((user) => (
            <tr
              key={user.id}
              onClick={() => handleRowClick(user)}
              className="cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <td className="px-6 py-4 text-sm text-gray-900">
                {formatUserFullName(user)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{user.dni}</td>
              <td className="px-6 py-4 text-sm">
                {user.role_granting_list.map((roleGrant) => (
                  <span
                    key={roleGrant.id}
                    className="inline-block px-2 py-1 mr-1 text-xs font-semibold text-gray-700 bg-yellow-100 rounded-full"
                  >
                    {capitalizeFirstLetter(roleGrant.role.name)}
                  </span>
                ))}

                {user.is_group_leader && (
                  <span
                  className="inline-block px-2 py-1 mr-1 text-xs font-semibold text-gray-700 bg-yellow-100 rounded-full"
                >
                  Líder de Grupo
                </span>
                )}
                {user.is_main_researcher && (
                  <span
                  className="inline-block px-2 py-1 mr-1 text-xs font-semibold text-gray-700 bg-yellow-100 rounded-full"
                >
                  Investigador Principal
                </span>
                )}
              </td>
              <td className="px-6 py-4 text-sm">
                <span
                  className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${user.is_Active
                    ? 'bg-green-200 text-green-800'
                    : 'bg-gray-200 text-gray-800'
                    }`}
                >
                  {user.is_Active ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="px-6 py-4 text-sm">
                <button
                  onClick={(e) => handleChangeStatus(user, e)}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    user.is_Active
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {user.is_Active ? 'Desactivar' : 'Activar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 