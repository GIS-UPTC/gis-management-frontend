import { handleApiError } from '@/utils/errorHandler';
import api from '../api';
import { Report } from '@/types/models/GeneralModels';

export class ReportServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ReportServiceError';
  }
}

export const reportService = {
  async generateReport(reportData: Report): Promise<string> {
    try {

      const formattedData = {
        format: reportData.format,
        report_type: reportData.report_type,
        start_date: reportData.start_date,
        end_date: reportData.end_date,
        line_id: null,
        researcher_id: null,

        ...(reportData.line_id ? { line_id: reportData.line_id} : {}),
        ...(reportData.researcher_id ? { researcher_id: reportData.researcher_id} : {}),
        ...(reportData.project_id ? { project_id: reportData.project_id} : {})
      }

      console.log(formattedData)

      const response = await api.post<string>('/reports/', formattedData);
      return response.data;
    } catch (error) {
      console.log(error)
      return handleApiError(
        error,
        ReportServiceError,
        'Error al generar el reporte. Por favor, intente nuevamente.'
      );
    }
  }
};