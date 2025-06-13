import { User, RoleGranting } from '@/types/models/GeneralModels';
import { encryptPassword } from '@/utils/encryptPassword';
import { handleApiError } from '@/utils/errorHandler';
import { createApiInstance } from './apiSSR';

export class UserServiceSSRError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserServiceSSRError';
  }
}

// Tipo para el role granting transformado para la API
interface TransformedRoleGranting {
  role_id: number;
  permissions_ids: number[];
}

// Función helper para formatear datos de usuario
const formatUserData = (
  userData: Omit<User, 'id'>, 
  transformRoleGrantingList: (roleGrantingList: RoleGranting[]) => TransformedRoleGranting[]
) => {
  return {
    name: userData.first_name,
    surname: userData.surname,
    email: userData.email,
    dni: userData.dni,
    dni_type: userData.dni_type,
    birthdate: userData.birthdate,
    is_main_researcher: userData.is_main_researcher,
    is_group_leader: userData.is_group_leader,
    role_granting_list: transformRoleGrantingList(userData.role_granting_list || [])
  };
};

/**
 * Servicio de usuarios optimizado para SSR
 * Puede funcionar tanto en cliente como en servidor
 */
export const userServiceSSR = {
  /**
   * Obtiene la lista de usuarios
   * @param name - Nombre para filtrar (puede estar vacío)
   * @param cookieHeader - Header de cookies del servidor (opcional)
   */
  async fetchUsers(name: string, cookieHeader?: string): Promise<User[]> {
    try {
      const api = createApiInstance(cookieHeader);
      const response = await api.get<User[]>(`/users/${name}?with_inactives=true&all=true`);
      return response.data;
    } catch (error) {
      console.log('UserServiceSSR - fetchUsers error:', error);
      return handleApiError(
        error,
        UserServiceSSRError,
        'Error al buscar usuarios. Por favor, intente nuevamente.'
      );
    }
  },

  /**
   * Busca usuarios por nombre
   * @param name - Nombre a buscar
   * @param cookieHeader - Header de cookies del servidor (opcional)
   */
  async searchUsersByName(name: string, cookieHeader?: string): Promise<User[]> {
    try {
      const api = createApiInstance(cookieHeader);
      const response = await api.get<User[]>(`/users/${name}?with_inactives=true`);
      return response.data;
    } catch (error) {
      console.log('UserServiceSSR - searchUsersByName error:', error);
      return handleApiError(
        error,
        UserServiceSSRError,
        'Error al buscar usuarios. Por favor, intente nuevamente.'
      );
    }
  },

  /**
   * Crea un nuevo usuario
   * @param userData - Datos del usuario
   * @param file - Archivo de imagen
   * @param cookieHeader - Header de cookies del servidor (opcional)
   */
  async createUser(userData: Omit<User, 'id'>, file?: File, cookieHeader?: string): Promise<User> {
    try {
      const transformRoleGrantingList = (roleGrantingList: RoleGranting[]): TransformedRoleGranting[] => {
        return roleGrantingList.map(item => ({
          role_id: item.role.id,
          permissions_ids: item.permissions.map(p => p.id)
        }));
      };

      const formattedData = formatUserData(userData, transformRoleGrantingList);
      const api = createApiInstance(cookieHeader);

      const formData = new FormData();

      if (file) {
        formData.append('file', file);
      } else {
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
      console.log('UserServiceSSR - createUser error:', error);
      return handleApiError(
        error,
        UserServiceSSRError,
        'Error al crear el usuario. Por favor, intente nuevamente.'
      );
    }
  },

  /**
   * Actualiza un usuario existente
   * @param id - ID del usuario
   * @param userData - Datos del usuario
   * @param cookieHeader - Header de cookies del servidor (opcional)
   */
  async updateUser(id: number, userData: Omit<User, 'id'>, cookieHeader?: string): Promise<User> {
    try {
      const transformRoleGrantingList = (roleGrantingList: RoleGranting[]): TransformedRoleGranting[] => {
        return roleGrantingList.map(item => ({
          role_id: item.role.id,
          permissions_ids: item.permissions.map(p => p.id)
        }));
      };

      const formattedData = formatUserData(userData, transformRoleGrantingList);
      const api = createApiInstance(cookieHeader);

      const response = await api.put<User>(`/users/${id}`, formattedData);
      return response.data;
    } catch (error) {
      console.log('UserServiceSSR - updateUser error:', error);
      return handleApiError(
        error,
        UserServiceSSRError,
        'Error al actualizar el usuario. Por favor, intente nuevamente.'
      );
    }
  },

  /**
   * Cambia la contraseña de un usuario
   * @param id - ID del usuario
   * @param newPassword - Nueva contraseña
   * @param cookieHeader - Header de cookies del servidor (opcional)
   */
  async changePassword(id: number, newPassword: string, cookieHeader?: string): Promise<string> {
    try {
      const encryptedPassword = encryptPassword(newPassword);
      const formattedData = {
        user_id: id,
        new_password: encryptedPassword,
      };

      const api = createApiInstance(cookieHeader);
      await api.patch('/users/password/change_password', formattedData);

      return 'Contraseña actualizada correctamente';
    } catch (error) {
      console.log('UserServiceSSR - changePassword error:', error);
      return handleApiError(
        error,
        UserServiceSSRError,
        'Error al cambiar la contraseña. Por favor, intente nuevamente.'
      );
    }
  },

  /**
   * Cambia el estado activo/inactivo de un usuario
   * @param id - ID del usuario
   * @param cookieHeader - Header de cookies del servidor (opcional)
   */
  async changeIsActiveUser(id: number, cookieHeader?: string): Promise<string> {
    try {
      const api = createApiInstance(cookieHeader);
      await api.patch(`/users/${id}`);
      return 'Estado cambiado correctamente';
    } catch (error) {
      console.log('UserServiceSSR - changeIsActiveUser error:', error);
      return handleApiError(
        error,
        UserServiceSSRError,
        'Error al cambiar el estado. Por favor, intente nuevamente.'
      );
    }
  },
}; 