import React, { useState } from 'react';
import { Combobox } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { ResearchLine } from '@/types/models/GeneralModels';

interface ResearchLineComboboxProps {
  lines: ResearchLine[];
  selectedLine: ResearchLine | null;
  onSelect: (line: ResearchLine) => void;
  onOpen: () => void;
  isLoading: boolean;
}

export default function ResearchLineCombobox({
  lines,
  selectedLine,
  onSelect,
  onOpen,
  isLoading
}: ResearchLineComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Combobox value={selectedLine} onChange={onSelect}>
      <div className="relative">
        <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left border focus-within:border-orange-500">
          <Combobox.Button
            className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 flex justify-between items-center"
            onClick={() => {
              setIsOpen(true);
              onOpen();
            }}
          >
            <span className="block truncate">
              {selectedLine ? selectedLine.name : "Seleccionar línea de investigación..."}
            </span>
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </Combobox.Button>
        </div>

        {isOpen && (
          <Combobox.Options 
            className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10"
            onBlur={() => setIsOpen(false)}
          >
            {isLoading ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                Cargando líneas de investigación...
              </div>
            ) : lines.length === 0 ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                No hay líneas de investigación disponibles
              </div>
            ) : (
              lines.map((line) => (
                <Combobox.Option
                  key={line.id}
                  value={line}
                  className={({ active }) => 
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-orange-100 text-orange-900' : 'text-gray-900'
                    }`
                  }
                >
                  {({ selected }) => (
                    <>
                      <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                        {line.name}
                      </span>
                      {selected && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-orange-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
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