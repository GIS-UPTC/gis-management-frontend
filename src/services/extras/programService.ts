import api from '../api';
import { Program } from '@/types/models/GeneralModels';
import { AxiosError } from 'axios';

interface ErrorResponse {
  detail: string;
}

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
      const axiosError = error as AxiosError<ErrorResponse>;
      if (axiosError.response?.data?.detail) {
        if(axiosError.response.data.detail === 'Token invalido' || axiosError.response.data.detail === 'Se ha terminado el tiempo de la sesion') {
          sessionStorage.removeItem('access_token');
        }
        throw new ProgramServiceError(axiosError.response.data.detail);
      }
      throw new ProgramServiceError('Error al buscar programas. Por favor, intente nuevamente.');
    }
  }
};