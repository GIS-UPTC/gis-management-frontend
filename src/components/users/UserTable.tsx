import React from 'react';
import { User } from '@/types/models/GeneralModels';

interface UserTableProps {
  users: User[];
}

const UserTable: React.FC<UserTableProps> = ({ users }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-yellow-200">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Nombres</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Apellidos</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Correo</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">DNI</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Roles</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Estado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 text-sm text-gray-900">
                {user.first_name} {user.other_name}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {user.surname} {user.other_surname}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{user.dni}</td>
              <td className="px-6 py-4 text-sm">
                {user.role_granting_list.map((roleGrant) => (
                  <span
                    key={roleGrant.id}
                    className="inline-block px-2 py-1 mr-1 text-xs font-semibold text-gray-700 bg-yellow-100 rounded-full"
                  >
                    {roleGrant.role.name}
                  </span>
                ))}
              </td>
              <td className="px-6 py-4 text-sm">
                <span
                  className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                    user.is_Active
                      ? 'bg-green-200 text-green-800'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {user.is_Active ? 'Activo' : 'Inactivo'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable; 