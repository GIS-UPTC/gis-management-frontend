import React, { useState, useEffect } from 'react';
import { InterestTopic } from '@/types/models/GeneralModels';
import { Combobox } from '@headlessui/react';
import { ChevronUpDownIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { topicService } from '@/services/topicService';
import { toast } from 'react-hot-toast';

interface TopicSelectorProps {
  selectedTopics: InterestTopic[];
  onTopicsChange: (topics: InterestTopic[]) => void;
}

interface ComboboxOptionRenderProps {
  selected: boolean;
  active: boolean;
}

export default function TopicSelector({ selectedTopics, onTopicsChange }: TopicSelectorProps) {
  const [query, setQuery] = useState('');
  const [availableTopics, setAvailableTopics] = useState<InterestTopic[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const searchTopics = async () => {
      if (query.length < 3) {
        setAvailableTopics([]);
        return;
      }

      setIsLoading(true);
      try {
        const topics = await topicService.searchTopics(query);
        // Filtrar tópicos que ya están seleccionados
        const filteredTopics = topics.filter(topic => 
          !selectedTopics.some(selected => selected.id === topic.id)
        );
        setAvailableTopics(filteredTopics);
      } catch (error) {
        console.error('Error searching topics:', error);
        toast.error('Error al buscar tópicos');
        setAvailableTopics([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchTopics, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, selectedTopics]);

  const handleSelect = (topic: InterestTopic | null) => {
    if (topic && !selectedTopics.find(t => t.id === topic.id)) {
      onTopicsChange([...selectedTopics, topic]);
      setQuery('');
    }
  };

  const handleRemove = (topicId: number) => {
    onTopicsChange(selectedTopics.filter(t => t.id !== topicId));
  };

  return (
    <div className="space-y-4">
      {/* Selected Topics */}
      <div className="flex flex-wrap gap-2">
        {selectedTopics.map(topic => (
          <div
            key={topic.id}
            className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
          >
            <span>{topic.description}</span>
            <button
              type="button"
              onClick={() => handleRemove(topic.id)}
              className="p-0.5 hover:bg-orange-200 rounded-full"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Combobox for adding new topics */}
      <Combobox<InterestTopic | null> value={null} onChange={handleSelect}>
        <div className="relative">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left border focus-within:border-orange-500">
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
              displayValue={() => query}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)}
              placeholder="Buscar tópicos de interés..."
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
                Buscando tópicos...
              </div>
            ) : availableTopics.length === 0 && query !== '' ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                {query.length < 3 ? 'Escriba al menos 3 caracteres para buscar' : 'No se encontraron tópicos.'}
              </div>
            ) : (
              availableTopics.map((topic) => (
                <Combobox.Option
                  key={topic.id}
                  className={({ active }: { active: boolean }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-orange-100 text-orange-900' : 'text-gray-900'
                    }`
                  }
                  value={topic}
                >
                  {({ selected, active }: ComboboxOptionRenderProps) => (
                    <>
                      <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                        {topic.description}
                      </span>
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