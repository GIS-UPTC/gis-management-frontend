import React, { useState, KeyboardEvent } from 'react';
import { Responsability } from '@/types/models/GeneralModels';
import { XMarkIcon } from '@heroicons/react/20/solid';

interface ResponsabilitySelectorProps {
  selectedResponsabilities: Responsability[];
  onResponsabilitiesChange: (responsabilities: Responsability[]) => void;
}

export default function ResponsabilitySelector({ selectedResponsabilities, onResponsabilitiesChange }: ResponsabilitySelectorProps) {
  const [inputValue, setInputValue] = useState('');
  // Contador para generar IDs temporales negativos para nuevas responsabilidades
  const [tempIdCounter, setTempIdCounter] = useState(-1);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Solo agregar cuando se presiona Enter
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevenir el envío del formulario
      addResponsability();
    }
  };

  const addResponsability = () => {
    const trimmedValue = inputValue.trim();
    
    if (!trimmedValue) return;
    
    // Verificar si ya existe una responsabilidad con la misma descripción
    const alreadyExists = selectedResponsabilities.some(
      r => r.description.toLowerCase() === trimmedValue.toLowerCase()
    );
    
    if (alreadyExists) {
      // Opcionalmente mostrar un mensaje de error
      // toast.error('Esta responsabilidad ya ha sido agregada');
      setInputValue('');
      return;
    }
    
    // Crear una nueva responsabilidad con ID temporal negativo
    const newResponsability: Responsability = {
      id: tempIdCounter,
      description: trimmedValue
    };
    
    // Actualizar el contador para el próximo ID temporal
    setTempIdCounter(prev => prev - 1);
    
    // Añadir la nueva responsabilidad a las seleccionadas
    onResponsabilitiesChange([...selectedResponsabilities, newResponsability]);
    
    // Limpiar el campo de entrada
    setInputValue('');
  };

  const handleRemove = (responsabilityId: number) => {
    onResponsabilitiesChange(selectedResponsabilities.filter(r => r.id !== responsabilityId));
  };

  return (
    <div className="space-y-4">
      {/* Input for adding new responsabilities */}
      <div className="relative">
        <input
          type="text"
          className="w-full py-2 px-3 rounded-lg border border-gray-300 focus:outline-none focus:border-orange-500"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ingrese una responsabilidad..."
        />
      </div>

      {/* Selected Responsabilities */}
      <div className="flex flex-wrap gap-2">
        {selectedResponsabilities.length === 0 ? (
          <div className="text-gray-500 italic text-sm">
            Digite y presione Enter para agregar una responsabilidad
          </div>
        ) : (
          selectedResponsabilities.map(responsability => (
            <div
              key={responsability.id}
              className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
            >
              <span>{responsability.description}</span>
              <button
                type="button"
                onClick={() => handleRemove(responsability.id)}
                className="p-0.5 hover:bg-orange-200 rounded-full"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}