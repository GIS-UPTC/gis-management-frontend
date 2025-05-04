import api from '../api';
import { Program } from '@/types/models/GeneralModels';
import { handleApiError } from '@/utils/errorHandler';

export class ProgramServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProgramServiceError';
  }
}

export const programService = {
  async searchPrograms(name: string): Promise<Program[]> {
    try {
      const response = await api.get<Program[]>(`/programs/${name}`);
      console.log(response)
      return response.data;
    } catch (error) {
      return handleApiError(
        error,
        ProgramServiceError,
        'Error al buscar programas. Por favor, intente nuevamente.'
      );}
  },
  async fetchPrograms(name: string): Promise<Program[]> {
    try {
      const response = await api.get<Program[]>(`/programs/${name}?all=true`);
      console.log(response)
      return response.data;
    } catch (error) {
      return handleApiError(
        error,
        ProgramServiceError,
        'Error al obtener programas. Por favor, intente nuevamente.'
      );
    }
  }
};