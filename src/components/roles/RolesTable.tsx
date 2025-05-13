import React from 'react';
import { useRouter } from 'next/navigation';
import { Access, Role } from '@/types/models/GeneralModels';
import { capitalizeFirstLetter } from '@/utils/stringUtils';
import { roleService } from '@/services/roleService';

interface RoleTableProps {
  roles: Role[];
}

export default function RoleTable({ roles }: RoleTableProps) {
  const router = useRouter();

  const handleRowClick = (role: Role) => {
    const encodedName = encodeURIComponent(role.name);
    console.log(encodedName);
    router.push(`/roles/${encodedName}`);
  };

  const handleChangeStatus = async (role: Role, e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que se active el click de la fila
    
    try {
      await roleService.changeIsActiveRole(role.id);
      window.location.reload();
      
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cambiar el estado');
    }
  };

  const formatAccesses = (accesses: Access[]) => {
    if (accesses.length <= 4) {
      return accesses.map(access => access.name).join(', ');
    } else {
      return accesses.slice(0, 4).map(access => access.name).join(', ') + '...';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-yellow-200">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Nombre</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Privilegios</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Estado</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Cambiar Estado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {roles.map((role, index) => (
            <tr
              key={index}
              onClick={() => handleRowClick(role)}
              className="cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <td className="px-6 py-4 text-sm text-gray-900">{capitalizeFirstLetter(role.name)}</td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {formatAccesses(role.accesses)}
              </td>
              <td className="px-6 py-4 text-sm">
                <span
                  className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                    role.is_active
                      ? 'bg-green-200 text-green-800'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {role.is_active ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="px-6 py-4 text-sm">
                <button
                  onClick={(e) => handleChangeStatus(role, e)}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    role.is_active
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {role.is_active ? 'Desactivar' : 'Activar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}