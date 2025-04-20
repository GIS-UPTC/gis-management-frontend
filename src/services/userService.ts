import api from '@/services/api';
import { User, SearchParams, RoleGranting, ChangePasswordResponse } from '@/types/models/GeneralModels';
import { encryptPassword } from '@/utils/encryptPassword';
import { handleApiError } from '@/utils/errorHandler';
import { AxiosError } from 'axios';

interface ErrorResponse {
  detail: string;
}

export class UserServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserServiceError';
  }
}

export const userService = {
  async createUser(userData: Omit<User, 'id'>, file?: File): Promise<User> {
    try {
      const transformRoleGrantingList = (roleGrantingList: RoleGranting[]) => {
        return roleGrantingList.map(item => ({
          role_id: item.role.id,
          permissions_ids: item.permissions.map(p => p.id)
        }));
      };

      const formattedData = {
        dni: userData.dni,
        first_name: userData.first_name,
        surname: userData.surname,
        other_name: userData.other_name,
        other_surname: userData.other_surname,
        email: userData.email,
        birthdate: userData.birthdate,
        photo_url: userData.photo_url,
        entry_date: userData.entry_date,
        links: userData.links,
        is_Active: userData.is_Active,
        deparure_date: userData.deparure_date,
        interest_topics: userData.interest_topics,
        participations: userData.participations,
        role_granting_list:  transformRoleGrantingList(userData.role_granting_list),
        responsibilities: userData.responsabilities,
        program: userData.program,
        is_group_leader: userData.is_group_leader,
        is_main_researcher: userData.is_main_researcher
      };



      const formData = new FormData();

      // Agregar el archivo si existe
      if (file) {
        formData.append('file', file);
      }

      console.log(formattedData)

      // Agregar los datos del usuario como json_data
      formData.append('json_data', JSON.stringify(formattedData));

      const response = await api.post<User>('/users', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return handleApiError(
        error,
        UserServiceError,
        'Error al crear el usuario. Por favor, intente nuevamente.'
      );
    }
  },

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    try {
      const response = await api.put<User>(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      return handleApiError(
        error,
        UserServiceError,
        'Error al actualizar el usuario. Por favor, intente nuevamente.'
      );
    }
  },

  async searchUsersByName(name: string): Promise<User[]> {
    try {
      const response = await api.get<User[]>(`/users/${name}?with_inactives=false`);
      console.log(response)
      return response.data;
    } catch (error) {
      return handleApiError(
        error,
        UserServiceError,
        'Error al buscar usuarios. Por favor, intente nuevamente.'
      );
    }
  },

  async changePassword(id: number, newPassword: string): Promise<string> {
    try {
      const encryptedPassword = encryptPassword(newPassword);
      const formattedData = {
        user_id: id,
        new_password: encryptedPassword,
      };

      console.log(formattedData)

      const response = await api.patch('/users/change_password', formattedData);
  
      console.log('Respuesta del servidor:', response.data);
  
      return 'Contraseña actualizada correctamente';
    } catch (error) {
      return handleApiError(
        error,
        UserServiceError,
        'Error al cambiar la contraseña. Por favor, intente nuevamente.'
      );
    }
  }
  
  
}; 