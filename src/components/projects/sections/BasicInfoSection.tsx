import React from 'react';
import { Project } from '@/types/models/project.models';

interface BasicInfoSectionProps {
  formData: Omit<Project, 'id'>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function BasicInfoSection({ formData, onInputChange, onCheckboxChange }: BasicInfoSectionProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
      <div className="col-span-1 sm:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Título *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={onInputChange}
          className="w-full p-2 border rounded-lg"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Convocatoria
        </label>
        <input
          type="text"
          name="convocation"
          value={formData.convocation}
          onChange={onInputChange}
          className="w-full p-2 border rounded-lg"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fecha de Creación *
        </label>
        <input
          type="date"
          name="creation_date"
          value={formData.creation_date}
          onChange={onInputChange}
          className="w-full p-2 border rounded-lg"
          required
          max={(() => {
            const today = new Date();
            const maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            return maxDate.toISOString().split('T')[0];
          })()}
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duración *
          </label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={onInputChange}
            className="w-full p-2 border rounded-lg"
            required
            min="1"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de duración *
          </label>
          <select
            name="duration_type"
            value={formData.duration_type}
            onChange={onInputChange}
            className="w-full p-2 border rounded-lg"
            required
          >
            <option value="DD">Días</option>
            <option value="MM">Meses</option>
            <option value="AA">Años</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Estado *
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={onInputChange}
          className="w-full p-2 border rounded-lg"
          required
        >
          <option value="AC">Activo</option>
          <option value="IN">Inactivo</option>
          <option value="EJ">En Ejecución</option>
          <option value="CN">Cancelado</option>
          <option value="FN">Finalizado</option>
          <option value="EM">En Mora</option>
        </select>
      </div>

      <div  className="col-span-1 sm:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          URL del Cronograma *
        </label>
        <input
          type="url"
          name="schedule_url"
          value={formData.schedule_url}
          onChange={onInputChange}
          className="w-full p-2 border rounded-lg"
          placeholder="https://..."
        />
      </div>

      <div className="col-span-1 sm:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descripción *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={onInputChange}
          className="w-full p-2 border rounded-lg"
          rows={4}
          required
        />
      </div>

      <div className="col-span-1 sm:col-span-2">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="has_financing"
            checked={formData.has_financing}
            onChange={onCheckboxChange}
            className="form-checkbox h-4 w-4 text-orange-600"
          />
          <span>¿Tiene financiamiento?</span>
        </label>
      </div>
    </div>
  );
} 