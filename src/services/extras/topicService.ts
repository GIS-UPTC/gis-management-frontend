import { handleApiError } from '@/utils/errorHandler';
import api from '../api';
import { InterestTopic } from '@/types/models/GeneralModels';

export class TopicServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TopicServiceError';
  }
}

export const topicService = {
  async searchTopics(name: string): Promise<InterestTopic[]> {
    try {
      const response = await api.get<InterestTopic[]>(`/interest_topics/${name}`);
      return response.data;
    } catch (error) {
      console.log(error)
      return handleApiError(
        error,
        TopicServiceError,
        'Error al buscar roles. Por favor, intente nuevamente.'
      );
    }
  }
};