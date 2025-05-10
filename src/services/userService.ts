import api from '@/services/api';
import { User, RoleGranting } from '@/types/models/GeneralModels';
import { encryptPassword } from '@/utils/encryptPassword';
import { handleApiError } from '@/utils/errorHandler';

export class UserServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserServiceError';
  }
}

// Tipo para la función de transformación de la lista de roles
type TransformRoleGrantingListFn = (roleGrantingList: RoleGranting[]) => Array<{ role_id: number; permissions_ids: number[] }>;

// Función para formatear los datos del usuario
const formatUserData = (userData: Omit<User, 'id'>, transformRoleGrantingList: TransformRoleGrantingListFn) => ({
  dni:             userData.dni,
  first_name:      userData.first_name,
  surname:         userData.surname,
  email:           userData.email,
  birthdate:       userData.birthdate,
  photo_url:       userData.photo_url,
  entry_date:      userData.entry_date,
  links:           userData.links,
  is_Active:       userData.is_Active,
  deparure_date:   userData.deparure_date === "" ? null : userData.deparure_date,
  interest_topics: userData.interest_topics,
  participations:  userData.participations,
  role_granting_list:  transformRoleGrantingList(userData.role_granting_list),
  responsibilities:     userData.responsabilities,
  program:              userData.program,
  is_group_leader:      userData.is_group_leader,
  is_main_researcher:   userData.is_main_researcher,

  ...(userData.other_name    ? { other_name:    userData.other_name    } : {}),
  ...(userData.other_surname ? { other_surname: userData.other_surname } : {})
});

export const userService = {
  async createUser(userData: Omit<User, 'id'>, file?: File): Promise<User> {
    try {
      const transformRoleGrantingList = (roleGrantingList: RoleGranting[]) => {
        return roleGrantingList.map(item => ({
          role_id: item.role.id,
          permissions_ids: item.permissions.map(p => p.id)
        }));
      };

      const formattedData = formatUserData(userData, transformRoleGrantingList);

      const formData = new FormData();

      if (file) {
        formData.append('file', file);
      }else{
        throw new Error('No se puede crear un usuario sin una foto');
      }

      formData.append('json_data', JSON.stringify(formattedData));

      const response = await api.post<User>('/users', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.log(error)
      return handleApiError(
        error,
        UserServiceError,
        'Error al crear el usuario. Por favor, intente nuevamente.'
      );
    }
  },

  async updateUser(id: number, userData: Omit<User, 'id'>): Promise<User> {
    try {
      const transformRoleGrantingList = (roleGrantingList: RoleGranting[]) => {
        return roleGrantingList.map(item => ({
          role_id: item.role.id,
          permissions_ids: item.permissions.map(p => p.id)
        }));
      };

      const formattedData = formatUserData(userData, transformRoleGrantingList);
      
      const response = await api.put<User>(`/users/${id}`, formattedData);
      return response.data;
    } catch (error) {
      console.log(error)
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
      return response.data;
    } catch (error) {
      console.log(error)
      return handleApiError(
        error,
        UserServiceError,
        'Error al buscar usuarios. Por favor, intente nuevamente.'
      );
    }
  },

  async fetchUsers(name: string): Promise<User[]> {
    try {
      const response = await api.get<User[]>(`/users/${name}?with_inactives=false&all=true`);
      return response.data;
    } catch (error) {
      console.log(error)
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

      await api.patch('/users/password/change_password', formattedData);
  
      return 'Contraseña actualizada correctamente';
    } catch (error) {
      console.log(error)
      return handleApiError(
        error,
        UserServiceError,
        'Error al cambiar la contraseña. Por favor, intente nuevamente.'
      );
    }
  }
  
  
}; 