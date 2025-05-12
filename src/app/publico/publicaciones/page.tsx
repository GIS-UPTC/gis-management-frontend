'use client';

import React, { useState, useEffect } from 'react';
import { groupInformationService, GroupInformationServiceError } from '@/services/extras/groupInformationService';
import { GroupProduct } from '@/types/models/groupInformation.models';

export default function PublicacionesPage() {
  const [products, setProducts] = useState<GroupProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await groupInformationService.getGroupProduct();
        setProducts(data);
      } catch (err) {
        console.error('Error al cargar productos:', err);
        if (err instanceof GroupInformationServiceError) {
          setError(err.message);
        } else {
          setError('No se pudieron cargar los productos. Por favor, intente nuevamente más tarde.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Obtener tipos únicos para el filtro
  const uniqueTypes = Array.from(new Set(products.map(product => product.type))).sort();

  // Filtrar productos
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.project.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === '' || product.type === filterType;
    
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Productos del Grupo</h1>
      
      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar por nombre, descripción o proyecto..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">Todos los tipos</option>
            {uniqueTypes.map((type, index) => (
              <option key={index} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de productos */}
      <div className="space-y-8">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-semibold text-primary-600">
                  {product.name}
                </h2>
                <div className="flex gap-2">
                  <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                    {product.type}
                  </span>
                  {product.subtype && (
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {product.subtype}
                    </span>
                  )}
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">
                <span className="font-medium">Proyecto:</span> {product.project}
              </p>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Descripción</h3>
                <p className="text-gray-600">{product.description}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No se encontraron productos que coincidan con los criterios de búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
