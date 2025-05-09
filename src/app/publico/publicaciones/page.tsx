'use client';

import React, { useState } from 'react';

interface Publication {
  id: number;
  year: number;
  title: string;
  url: string;
  authors: string[];
  abstract: string;
}

const publicationsData: Publication[] = [
  {
    id: 1,
    year: 2023,
    title: "Avances en sistemas de monitoreo ambiental basados en IoT",
    url: "https://example.com/publication1",
    authors: ["Ana Cecilia Villa Parra", "Juan Pérez", "María Rodríguez"],
    abstract: "Este estudio presenta un sistema de monitoreo ambiental basado en Internet de las Cosas (IoT) para la medición de variables ambientales en tiempo real. El sistema utiliza sensores de bajo costo y bajo consumo energético para medir temperatura, humedad, calidad del aire y niveles de ruido en entornos urbanos."
  },
  {
    id: 2,
    year: 2022,
    title: "Aplicaciones de inteligencia artificial en el diagnóstico médico temprano",
    url: "https://example.com/publication2",
    authors: ["Carlos Gómez", "Ana Cecilia Villa Parra", "Laura Sánchez"],
    abstract: "Esta investigación explora el uso de algoritmos de aprendizaje profundo para mejorar la precisión del diagnóstico médico temprano en enfermedades cardiovasculares. Los resultados muestran una mejora significativa en la detección temprana de patologías cuando se combinan técnicas de procesamiento de imágenes con redes neuronales convolucionales."
  },
  {
    id: 3,
    year: 2022,
    title: "Desarrollo de prótesis biónicas controladas por señales mioeléctricas",
    url: "https://example.com/publication3",
    authors: ["Ana Cecilia Villa Parra", "Roberto Martínez", "Sofía López"],
    abstract: "Este trabajo presenta el diseño y desarrollo de una prótesis biónica de miembro superior controlada por señales mioeléctricas. Se implementaron algoritmos de procesamiento de señales para interpretar la actividad muscular y traducirla en movimientos precisos de la prótesis, mejorando significativamente la experiencia del usuario."
  },
  {
    id: 4,
    year: 2021,
    title: "Sistemas de control adaptativo para rehabilitación robótica",
    url: "https://example.com/publication4",
    authors: ["Pedro Ramírez", "Ana Cecilia Villa Parra", "Javier Torres"],
    abstract: "Esta investigación presenta un enfoque de control adaptativo para dispositivos de rehabilitación robótica. El sistema propuesto ajusta dinámicamente los parámetros de asistencia basándose en el rendimiento y fatiga del paciente, optimizando así el proceso de rehabilitación y mejorando los resultados terapéuticos."
  },
  {
    id: 5,
    year: 2020,
    title: "Interfaces cerebro-computadora para asistencia en movilidad reducida",
    url: "https://example.com/publication5",
    authors: ["Ana Cecilia Villa Parra", "Diego Hernández", "Valentina Ruiz"],
    abstract: "Este estudio explora el desarrollo de interfaces cerebro-computadora no invasivas para asistir a personas con movilidad reducida. Se implementaron algoritmos de procesamiento de señales EEG para detectar intenciones de movimiento y controlar dispositivos de asistencia, proporcionando mayor autonomía a los usuarios."
  },
];

export default function PublicacionesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState<number | null>(null);

  // Obtener años únicos para el filtro
  const uniqueYears = Array.from(new Set(publicationsData.map(pub => pub.year))).sort((a, b) => b - a);

  // Filtrar publicaciones
  const filteredPublications = publicationsData.filter(publication => {
    const matchesSearch = searchTerm === '' || 
      publication.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      publication.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase())) ||
      publication.abstract.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesYear = filterYear === null || publication.year === filterYear;
    
    return matchesSearch && matchesYear;
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Publicaciones Académicas</h1>
      
      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar por título, autor o contenido..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={filterYear || ''}
            onChange={(e) => setFilterYear(e.target.value ? parseInt(e.target.value) : null)}
          >
            <option value="">Todos los años</option>
            {uniqueYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de publicaciones */}
      <div className="space-y-8">
        {filteredPublications.length > 0 ? (
          filteredPublications.map(publication => (
            <div key={publication.id} className="border-b border-gray-200 pb-6 last:border-0">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-semibold text-primary-600">
                  <a 
                    href={publication.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {publication.title}
                  </a>
                </h2>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                  {publication.year}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">
                <span className="font-medium">Autores:</span> {publication.authors.join(', ')}
              </p>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Resumen</h3>
                <p className="text-gray-600">{publication.abstract}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No se encontraron publicaciones que coincidan con los criterios de búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
