import React, { useState, useEffect } from 'react';
import { Program } from '@/types/models/GeneralModels';
import { Combobox } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { programService } from '@/services/programService';
import { toast } from 'react-hot-toast';

interface ProgramSelectorProps {
  selectedProgram: Program | null;
  onProgramChange: (program: Program) => void;
}

interface ComboboxOptionRenderProps {
  selected: boolean;
  active: boolean;
}

export default function ProgramSelector({ selectedProgram, onProgramChange }: ProgramSelectorProps) {
  const [query, setQuery] = useState('');
  const [availablePrograms, setAvailablePrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const searchPrograms = async () => {
      if (query.length < 3) {
        setAvailablePrograms([]);
        return;
      }

      setIsLoading(true);
      try {
        const programs = await programService.searchPrograms(query);
        setAvailablePrograms(programs);
      } catch (error) {
        console.error('Error searching programs:', error);
        toast.error('Error al buscar programas');
        setAvailablePrograms([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchPrograms, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const filteredPrograms = availablePrograms;

  return (
    <div className="w-full">
      <Combobox value={selectedProgram} onChange={onProgramChange}>
        <div className="relative">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left border focus-within:border-orange-500">
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
              displayValue={(program: Program | null) => program?.name || ''}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)}
              placeholder="Buscar programa..."
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
            {isLoading ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                Buscando programas...
              </div>
            ) : filteredPrograms.length === 0 && query !== '' ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                {query.length < 3 ? 'Escriba al menos 3 caracteres para buscar' : 'No se encontraron programas.'}
              </div>
            ) : (
              filteredPrograms.map((program) => (
                <Combobox.Option
                  key={program.id}
                  className={({ active }: { active: boolean }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-orange-100 text-orange-900' : 'text-gray-900'
                    }`
                  }
                  value={program}
                >
                  {({ selected, active }: ComboboxOptionRenderProps) => (
                    <>
                      <div className="flex flex-col">
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                          {program.name}
                        </span>
                        <span className={`block truncate text-sm ${
                          active ? 'text-orange-700' : 'text-gray-500'
                        }`}>
                          {program.faculty.name} - {program.faculty.university.name}
                        </span>
                      </div>
                      {selected && (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? 'text-orange-600' : 'text-orange-600'
                          }`}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </div>
      </Combobox>

      {selectedProgram && selectedProgram.id && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Programa seleccionado:</h4>
          <div className="font-medium">{selectedProgram.name}</div>
          <div className="text-sm text-gray-600">
            {selectedProgram.faculty.name} - {selectedProgram.faculty.university.name}
          </div>
        </div>
      )}
    </div>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
} 