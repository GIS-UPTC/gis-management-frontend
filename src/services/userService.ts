import api from './api';
import { User, SearchParams } from '@/types/models/GeneralModels';

export const userService = {
  getUsers: async (params?: SearchParams) => {
    const response = await api.get<User[]>('/users', { params });
    return response.data;
  },

  searchUsers: async (name: string) => {
    const response = await api.get<User[]>('/users/search', {
      params: { name }
    });
    return response.data;
  },

  getUserById: async (id: number) => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  createUser: async (userData: Omit<User, 'id'>) => {
    console.log(userData)
    const response = await api.post<User>('/users', userData);
    return response.data;
  },

  updateUser: async (id: number, userData: Partial<User>) => {
    const response = await api.put<User>(`/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: number) => {
    await api.delete(`/users/${id}`);
  }
}; 