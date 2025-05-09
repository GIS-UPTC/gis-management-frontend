import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { projectService } from '@/services/projectService';
import { initMousePositionTracking } from '@/utils/mousePosition';

interface ProjectStatusChangerProps {
  projectId: number;
  currentStatus: string;
  onStatusChange?: () => void;
}

export default function ProjectStatusChanger({ projectId, currentStatus, onStatusChange }: ProjectStatusChangerProps) {
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  // Inicializar el rastreador de posición del mouse
  useEffect(() => {
    const cleanup = initMousePositionTracking();
    return cleanup;
  }, []);
  
  // Cerrar el menú desplegable cuando se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isStatusDropdownOpen && buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsStatusDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isStatusDropdownOpen]);

  const projectStatus: Record<string, string> = {
    "AC": "Activo",
    "IN": "Inactivo",
    "EJ": "En ejecución",
    "CN": "Cancelado",
    "FN": "Finalizado"
  };

  const getStatusClass = (status: string) => {
    const statusClassMap: Record<string, string> = {
      'EJ': 'bg-blue-100 text-blue-800',
      'AC': 'bg-green-100 text-green-800',
      'IN': 'bg-gray-200 text-gray-800',
      'CN': 'bg-red-100 text-red-800',
      'FN': 'bg-purple-100 text-purple-800'
    };
    return statusClassMap[status] || 'bg-gray-200 text-gray-800';
  };

  const getStatus = (status: string) => {
    return projectStatus[status] || status;
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await projectService.changeProjectStatus(projectId, newStatus);
      setIsStatusDropdownOpen(false);
      toast.success('Estado actualizado correctamente');
      if (onStatusChange) {
        onStatusChange();
      }
    } catch {
      toast.error('Error al actualizar el estado');
    }
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsStatusDropdownOpen(!isStatusDropdownOpen);
        }}
        className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(currentStatus)}`}
      >
        {getStatus(currentStatus)}
        <svg
          className="w-3 h-3 ml-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isStatusDropdownOpen && (
        <div 
          className="fixed z-50 mt-1 w-32 bg-white rounded-lg shadow-lg border"
          style={{
            position: 'fixed',
            top: 'calc(var(--mouse-y) + 10px)',
            left: 'calc(var(--mouse-x) - 50px)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="py-1">
            {Object.keys(projectStatus).map((status) => (
              <button
                key={status}
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusChange(status);
                }}
                className={`w-full text-left px-3 py-1 text-xs hover:bg-gray-100 ${getStatusClass(status)}`}
              >
                {getStatus(status)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
