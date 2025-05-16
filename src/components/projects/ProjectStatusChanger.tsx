import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { projectService } from '@/services/projectService';

interface ProjectStatusChangerProps {
  projectId: number;
  currentStatus: string;
  onStatusChange?: () => void;
}

export default function ProjectStatusChanger({ projectId, currentStatus, onStatusChange }: ProjectStatusChangerProps) {
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [localStatus, setLocalStatus] = useState(currentStatus);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  useEffect(() => {
    setLocalStatus(currentStatus);
  }, [currentStatus]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsStatusDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
      setLocalStatus(newStatus);
      setIsStatusDropdownOpen(false);
      toast.success('Estado actualizado correctamente');
      if (onStatusChange) {
        onStatusChange();
      }
    } catch(error) {
      console.error('Error al actualizar el estado:', error);
      toast.error('Error al actualizar el estado');
    }
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsStatusDropdownOpen(!isStatusDropdownOpen);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleDropdown}
        className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(localStatus)}`}
      >
        {getStatus(localStatus)}
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
          className="absolute z-50 mt-1 w-32 bg-white rounded-lg shadow-lg border"
          style={{
            top: '100%',
            left: '0',
          }}
        >
          <div className="py-1">
            {Object.keys(projectStatus).map((status) => (
              <button
                key={status}
                onClick={(e) => {
                  e.preventDefault();
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
