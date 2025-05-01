'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import { Product } from '@/types/models/GeneralModels';
import { productService, ProductServiceError } from '@/services/productsService';
import { toast, Toaster } from 'react-hot-toast';
import ArrowLeftIcon from '@heroicons/react/24/outline/ArrowLeftIcon';
import Link from 'next/link';

export default function ProductDetailsPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productName = decodeURIComponent(params.name as string);
        const productData = await productService.getProducts(productName);

        if (!productData) {
          toast.error('Producto no encontrado');
          return;
        }

        setProduct(productData[0]);

      } catch (error) {
        if (error instanceof ProductServiceError) {
          toast.error(error.message);
        } else {
          const errorMessage = 'Ocurrió un error inesperado. Por favor, intente nuevamente.';
          toast.error(errorMessage);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [params.name]);

  if (isLoading) {
    return (
      <>
        <Header moduleName="Productos" />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header moduleName="Productos" />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-8 text-gray-500">
            Producto no encontrado
          </div>
        </div>
      </>
    );
  }

  return (
    <>
    <Toaster position="top-center" />
      <Header moduleName="Productos" />
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <Link href="/productos" className="mr-4">
            <ArrowLeftIcon className="h-8 w-8 text-black hover:text-orange-600" />
          </Link>
          <h1 className="text-2xl font-bold">Detalles del Producto</h1>
          <button
            onClick={() => window.location.href = `/productos/nuevo?edit=${encodeURIComponent(product.name)}`}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Editar Producto
          </button>
        </div>
  
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Información básica del producto */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Información General</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Código</label>
                  <p className="mt-1">{product.code}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre</label>
                  <p className="mt-1">{product.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Descripción</label>
                  <p className="mt-1">{product.description}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tipo</label>
                  <p className="mt-1">{product.type.name}</p>
                </div>
                {product.type.subtype_name && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Subtipo</label>
                    <p className="mt-1">{product.type.subtype_name}</p>
                  </div>
                )}
                {product.project && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Proyecto</label>
                    <p className="mt-1">{product.project.title}</p>
                  </div>
                )}
                {product.url && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">URL</label>
                    <p className="mt-1">
                      <a 
                        href={product.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {product.url}
                      </a>
                    </p>
                  </div>
                )}
                {product.complementary_information && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Información Complementaria</label>
                    <p className="mt-1">{product.complementary_information}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}