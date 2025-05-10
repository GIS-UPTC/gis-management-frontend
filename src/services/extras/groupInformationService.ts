import api from '@/services/api';
import { Organization } from '@/types/models/GeneralModels';
import { handleApiError } from '@/utils/errorHandler';

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
      console.log(error);
      return handleApiError(
        error,
        GroupInformationServiceError,
        'Error al obtener la informacion del grupo. Por favor, intente nuevamente.'
      );
    }
  },
};
