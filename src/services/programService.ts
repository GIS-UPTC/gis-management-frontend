import api from './api';
import { Program } from '@/types/models/GeneralModels';

export const programService = {
  searchPrograms: async (name: string) => {
    const response = await api.get<Program[]>(`/programs/${name}`);
    return response.data;
  }
}; 