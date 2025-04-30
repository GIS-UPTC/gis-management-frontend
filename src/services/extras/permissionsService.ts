import api from '../api';
import { Permission } from '@/types/models/GeneralModels';
import { handleApiError } from '@/utils/errorHandler';

export class PermissionServiceError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'PermissionServiceError';
    }
}

export const permissionService = {
    async searchPermissions(name: string): Promise<Permission[]> {
        try {
            const response = await api.get<Permission[]>(`/permissions/${name}`);
            console.log(response);
            return response.data;
        } catch (error) {
            return handleApiError(
                error,
                PermissionServiceError,
                'Error al buscar roles. Por favor, intente nuevamente.'
            );
        }
    }
};
