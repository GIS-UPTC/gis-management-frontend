'use client';

import React, { useState, useEffect } from 'react';
import { Report, ResearchLine, User } from '@/types/models/GeneralModels';
import { projectService } from '@/services/projectService';
import { userService } from '@/services/userService';
import { researchLineService } from '@/services/researchLineService';
import SearchBar from '@/components/ui/SearchBar';
import Header from '@/components/layout/Header';
import { Project } from '@/types/models/project.models';
import ResearchLineCombobox from '@/components/ui/ResearchLineComboBox';
import SelectionCard from '@/components/progresses/components/SelectionCard';
import { reportService } from '@/services/extras/reportService';
import toast, { Toaster } from 'react-hot-toast';

export default function GenerateReportPage() {
  // Report state
  const [report, setReport] = useState<Report>({
    format: 'PDF',
    report_type: 'TPR',
    start_date: '',
    end_date: '',
    project_id: null,
    researcher_id: null,
    line_id: null,
  });

  // Selected entities state
  const [projects, setProjects] = useState<Project[]>([]);
  const [researchers, setResearchers] = useState<User[]>([]);
  const [lines, setLines] = useState<ResearchLine[]>([]);

  const [projectSelected, setProjectSelected] = useState<Project | null>(null);
  const [researchSelected, setResearchSelected] = useState<User | null>(null);
  const [lineSelected, setLineSelected] = useState<ResearchLine | null>(null);

  // Loading states
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingLines, setIsLoadingLines] = useState(false);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setReport(prev => ({ ...prev, [name]: value }));

    // Reset related fields when report type changes
    if (name === 'report_type') {
      setReport(prev => ({
        ...prev,
        project_id: null,
        researcher_id: null,
        line_id: null
      }));
      setProjects([]);
      setResearchers([]);
      setLines([]);
    }
  };

  // Search functions
  const handleProjectSearch = async (query: string) => {
    if (query.length >= 3) {
      setIsLoadingProjects(true);
      try {
        const projects = await projectService.searchProjects(query);
        setProjects(projects)
      } catch (error) {
        toast.error('Error al buscar proyectos');
        console.error('Error searching projects:', error);
        return [];
      } finally {
        setIsLoadingProjects(false);
      }
    }
    return [];
  };

  const handleResearcherSearch = async (query: string) => {
    if (query.length >= 3) {
      setIsLoadingUsers(true);
      try {
        const users = await userService.searchUsersByName(query);
        setResearchers(users)
      } catch (error) {
        toast.error('Error al buscar usuarios');
        console.error('Error searching users:', error);
        return [];
      } finally {
        setIsLoadingUsers(false);
      }
    }
    return [];
  };

  const fetchResearchLines = async () => {
    setIsLoadingLines(true);
    try {
      const lines = await researchLineService.fetchResearchLines(' ');
      setLines(lines);
    } catch (error) {
      toast.error('Error al cargar las líneas de investigación');
      console.error('Error fetching research lines:', error);
    } finally {
      setIsLoadingLines(false);
    }
  };

  // Selection handlers
  const handleProjectSelect = (project: Project) => {
    setProjectSelected(project)
    setReport(prev => ({
      ...prev,
      project_id: project.id
    }));
  };

  const handleResearcherSelect = (researcher: User) => {
    setResearchSelected(researcher)
    setReport(prev => ({ ...prev, researcher_id: researcher.id }));
  };

  const handleLineSelect = (line: ResearchLine) => {
    setLineSelected(line)
    setReport(prev => ({ ...prev, line_id: line.id }));
  };

  const clearProjectSelection = () => {
    setProjectSelected(null);
    setReport(prev => ({ ...prev, project_id: null }));
  };

  const clearResearcherSelection = () => {
    setResearchSelected(null);
    setReport(prev => ({ ...prev, researcher_id: null }));
  };

  const clearLineSelection = () => {
    setLineSelected(null);
    setReport(prev => ({ ...prev, line_id: null }));
  };

  // Generate report
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await reportService.generateReport(report)
      console.log(result)
    } catch (error) {
      toast.error('Error al generar el reporte');
      console.log(error)
    }
  };

  // Determine which fields to show based on report type
  const shouldShowProjectField = ['PDP', 'AVP', 'APU'].includes(report.report_type);
  const shouldShowResearcherField = ['AVU', 'APU'].includes(report.report_type);
  const shouldShowLineField = ['PRL'].includes(report.report_type);

  // Report type mapping for display
  const reportTypeOptions = [
    { value: 'TPR', label: 'Reportes de todos los proyectos' },
    { value: 'PRL', label: 'Reportes de proyectos por línea de investigación' },
    { value: 'TPD', label: 'Reportes de todos los productos' },
    { value: 'PDP', label: 'Reportes de productos por proyecto' },
    { value: 'TAV', label: 'Reportes de todos los avances' },
    { value: 'AVP', label: 'Reportes de avances por proyecto' },
    { value: 'AVU', label: 'Reportes de avances por usuario' },
    { value: 'APU', label: 'Reportes de avances por proyecto y usuario' }
  ];

  return (
    <>
    <Toaster position="top-center" />
      <Header moduleName="Reportes" />
      <div className="w-full max-w-4xl mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Generación de Reportes</h1>

        <div className="bg-white p-6 rounded shadow">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2 font-medium">Formato del Reporte *</label>
              <select
                name="format"
                value={report.format}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="PDF">PDF</option>
                <option value="XLSX">Excel (XLSX)</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-medium">Tipo de Reporte *</label>
              <select
                name="report_type"
                value={report.report_type}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                {reportTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-medium">Fecha y Hora de Inicio *</label>
              <input
                type="datetime-local"
                name="start_date"
                value={report.start_date}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
                max={(() => {
                  const today = new Date();
                  return today.toISOString().slice(0, 16);
                })()}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-medium">Fecha y Hora de Fin *</label>
              <input
                type="datetime-local"
                name="end_date"
                value={report.end_date}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
                max={(() => {
                  const today = new Date();
                  return today.toISOString().slice(0, 16);
                })()}
              />
            </div>

            {shouldShowProjectField && (
              <div className="mb-4 relative">
                <label className="block mb-2 font-medium">Proyecto</label>
                {!projectSelected ? (
                  <>
                    <div onClick={(e) => e.stopPropagation()}>
                      <SearchBar
                        onSearch={handleProjectSearch}
                        isLoading={isLoadingProjects}
                        placeholder="Buscar proyecto por título..."
                      />
                    </div>

                    {projects.length > 0 && (
                      <div className="absolute mt-1 w-full z-10 bg-white border rounded-md shadow-lg max-h-60 overflow-auto" onClick={(e) => e.stopPropagation()}>
                        {projects.map((project) => (
                          <div
                            key={project.id}
                            className="p-3 hover:bg-orange-100 cursor-pointer border-b"
                            onClick={() => handleProjectSelect(project)}
                          >
                            <div className="font-medium">{project.title}</div>
                            <div className="text-sm text-gray-500">ID: {project.id}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <SelectionCard
                    item={projectSelected}
                    type="project"
                    onClear={clearProjectSelection}
                  />
                )}
              </div>
            )}

            {shouldShowResearcherField && (
              <div className="mb-4 relative">
                <label className="block mb-2 font-medium">Investigador</label>
                {!researchSelected ? (
                  <>
                    <div onClick={(e) => e.stopPropagation()}>
                      <SearchBar
                        onSearch={handleResearcherSearch}
                        isLoading={isLoadingUsers}
                        placeholder="Buscar investigador por nombre..."
                      />
                    </div>

                    {researchers.length > 0 && (
                      <div className="absolute mt-1 w-full z-10 bg-white border rounded-md shadow-lg max-h-60 overflow-auto" onClick={(e) => e.stopPropagation()}>
                        {researchers.map((user) => (
                          <div
                            key={user.id}
                            className="p-3 hover:bg-orange-100 cursor-pointer border-b"
                            onClick={() => handleResearcherSelect(user)}
                          >
                            <div className="font-medium">{user.first_name} {user.other_name ?? ''} {user.surname} {user.other_surname ?? ''}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <SelectionCard
                    item={researchSelected}
                    type="researcher"
                    onClear={clearResearcherSelection}
                  />
                )}
              </div>
            )}

            {shouldShowLineField && (
              <div className="mb-4">
                <label className="block mb-2 font-medium">Línea de Investigación</label>
                {!lineSelected ? (
                  <ResearchLineCombobox
                    lines={lines}
                    selectedLine={lineSelected}
                    onSelect={handleLineSelect}
                    onOpen={fetchResearchLines}
                    isLoading={isLoadingLines}
                  />
                ) : (
                  <SelectionCard
                    item={lineSelected}
                    type="line"
                    onClear={clearLineSelection}
                  />
                )}
              </div>
            )}

            <div className="mt-6">
              <button
                type="submit"
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                disabled={!report.start_date || !report.end_date}
              >
                Generar Reporte
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}