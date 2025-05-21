// services/progressService.ts
import { handleApiError, ServiceError } from '@/utils/errorHandler';
import api from './api';
import { Progress } from '@/types/models/GeneralModels';

// Error específico para el servicio de avances
export class ProgressServiceError extends ServiceError {
    constructor(message: string) {
        super(message, 'ProgressServiceError');
    }
}

export const progressService = {

    async searchProgresses(name: string): Promise<Progress[]> {
        try {
            const response = await api.get<Progress[]>(`/progresses/${name}`);
            return response.data;
        } catch (error) {
            return handleApiError(
                error,
                ProgressServiceError,
                'Error al buscar avances. Por favor, intente nuevamente.'
            );
        }
    },

    async fetchProgresses(name: string): Promise<Progress[]> {
        try {
            const response = await api.get<Progress[]>(`/progresses/${name}?all=true`);
            return response.data;
        } catch (error) {
            return handleApiError(
                error,
                ProgressServiceError,
                'Error al buscar avances. Por favor, intente nuevamente.'
            );
        }
    },

    async createProgress(progressData: Omit<Progress, 'id'>, file?: File): Promise<Progress> {
        try {

            const formattedData = {
                type: progressData.type,
                user_id: progressData.user.id,
                project_id: progressData.project.id,
                
                ...(progressData.description ? { description: progressData.description } : {}),
                ...(progressData.document_link ? { document_link: progressData.document_link } : {})
            }

            console.log(formattedData)

            const formData = new FormData();

            if(file){
                formData.append('file', file);
            }else{
                throw new Error('No se puede crear un avance sin un archivo anexado');
            }   

            formData.append('json_data', JSON.stringify(formattedData));

            const response = await api.post<Progress>('/progresses', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              });

            return response.data;
        } catch (error) {
            return handleApiError(
                error,
                ProgressServiceError,
                'Error al crear el avance. Por favor, intente nuevamente.'
            );
        }
    },

    async deleteProgress(id: number): Promise<void> {
        try {
            await api.delete(`/progresses/${id}`);
        } catch (error) {
            return handleApiError(
                error,
                ProgressServiceError,
                'Error al eliminar el avance. Por favor, intente nuevamente.'
            );
        }
    }
};