'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import { Product } from '@/types/models/GeneralModels';
import { productService, ProductServiceError } from '@/services/productsService';
import { toast, Toaster } from 'react-hot-toast';
import { ArrowLeftIcon, LinkIcon, DocumentTextIcon, CalendarIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { capitalizeFirstLetter } from '@/utils/stringUtils';

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
        <div className="flex items-center mb-6">
          <Link href="/productos" className="mr-4">
            <ArrowLeftIcon className="h-8 w-8 text-black hover:text-orange-600" />
          </Link>
          <h1 className="text-2xl font-bold">Detalle del Producto</h1>
          <div className="ml-auto">
            <button
              onClick={() => window.location.href = `/productos/nuevo?edit=${encodeURIComponent(product.name)}`}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Editar Producto
            </button>
          </div>
        </div>

        <div className="bg-customLightYellow rounded-lg shadow p-6">
          {/* Información básica del producto */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Información General</h2>
            <div className="bg-white rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4">
                <h3 className="font-bold text-lg">{capitalizeFirstLetter(product.name)}</h3>
                {product.description && (
                  <p className="text-gray-700 mt-2">{capitalizeFirstLetter(product.description)}</p>
                )}
              </div>
              <div className="flex items-center">
                <div className="bg-orange-100 p-2 rounded-full mr-3">
                  <DocumentTextIcon className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Código</p>
                  <p className="font-medium">{product.code}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tipo y Subtipo */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Clasificación</h2>
            <div className="bg-white rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <div className="bg-orange-100 p-2 rounded-full mr-3">
                  <DocumentTextIcon className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tipo</p>
                  <p className="font-medium">{capitalizeFirstLetter(product.type.name)}</p>
                </div>
              </div>

              {product.type.subtype_name && (
                <div className="flex items-center">
                  <div className="bg-orange-100 p-2 rounded-full mr-3">
                    <DocumentTextIcon className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Subtipo</p>
                    <p className="font-medium">{capitalizeFirstLetter(product.type.subtype_name)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Proyecto asociado */}
          {product.project && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Proyecto Asociado</h2>
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center">
                  <div className="bg-orange-100 p-2 rounded-full mr-3">
                    <CalendarIcon className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Título del proyecto</p>
                    <p className="font-medium">{capitalizeFirstLetter(product.project.title)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* URL */}
          {product.url && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Enlace</h2>
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center">
                  <LinkIcon className="h-6 w-6 text-blue-600 mr-2" />
                  <a
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {product.url}
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Información Complementaria */}
          {product.complementary_information && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Información Complementaria</h2>
              <div className="bg-white rounded-lg p-4">
                <p>{product.complementary_information}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}