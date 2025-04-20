import api from '@/services/api';
import { Organization } from '@/types/models/GeneralModels';
import { AxiosError } from 'axios';

interface ErrorResponse {
  detail: string;
}

export class GroupInformationServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GroupInformationServiceError';
  }
}

export const groupInformationService = {
  async getGroupInformation(): Promise<Organization> {
    try {
      const response = await api.get<Organization>('/group_information/');
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      if (axiosError.response?.data?.detail) {
        if(axiosError.response.data.detail === 'Token invalido' || axiosError.response.data.detail === 'Se ha terminado el tiempo de la sesion') {
          sessionStorage.removeItem('access_token');
        }
        throw new GroupInformationServiceError(axiosError.response.data.detail);
      }
      throw new GroupInformationServiceError(
        'Error al obtener la información del grupo. Por favor, intente nuevamente.'
      );
    }
  },
};
