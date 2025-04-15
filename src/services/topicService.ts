import api from './api';
import { InterestTopic } from '@/types/models/GeneralModels';

export const topicService = {
  searchTopics: async (name: string) => {
    const response = await api.get<InterestTopic[]>(`/interest_topics/${name}`);
    return response.data;
  }
}; 