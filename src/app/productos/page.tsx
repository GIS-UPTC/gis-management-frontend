'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import ProductsTable from '@/components/products/ProductsTable';
import { Product } from '@/types/models/GeneralModels';
import { productService, ProductServiceError } from '@/services/productsService';
import { toast, Toaster } from 'react-hot-toast';
import SearchBar from '@/components/ui/SearchBar';

export default function ProductosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadProducts(searchQuery);
  }, [searchQuery]);

  const loadProducts = async (query: string) => {
    setIsLoading(true);
    try {
      if(query.length > 2) {
        const productData = await productService.getProducts(query);
        setProducts(productData);
      }
    } catch (error) {
      if (error instanceof ProductServiceError) {
        setError(error.message);
        toast.error(error.message);
      } else {
        const errorMessage = 'Ocurrió un error al cargar los productos. Por favor, intente nuevamente.';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleDelete = async (code: string) => {
    if (window.confirm('¿Está seguro que desea eliminar este producto?')) {
      try {
        await productService.deleteProduct(code);
        toast.success('Producto eliminado correctamente');
        loadProducts(searchQuery);
      } catch (error) {
        if (error instanceof ProductServiceError) {
          toast.error(error.message);
        } else {
          toast.error('Error al eliminar el producto');
        }
      }
    }
  };

  return (
    <>
    <Toaster position="top-center" />
      <Header moduleName="Productos" />
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Listado de Productos</h1>
          <Link
            href="/productos/nuevo"
            className="bg-customDarkGreen hover:bg-green-200 text-black font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Agregar Producto...
          </Link>
        </div>

        <div className="mb-6">
          <SearchBar 
            onSearch={handleSearch} 
            isLoading={isLoading} 
            placeholder="Buscar productos..."
          />
        </div>

        {error ? (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        ) : isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : products.length > 0 ? (
          <div className="bg-white rounded-lg shadow">
            <ProductsTable products={products} onDelete={handleDelete} />
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No hay productos registrados
          </div>
        )}
      </div>
    </>
  );
}