import api from './api';
import { Role } from '@/types/models/GeneralModels';

export const roleService = {
  searchRoles: async (name: string) => {
    const response = await api.get<Role[]>(`/roles/${name}`);
    return response.data;
  }
}; 