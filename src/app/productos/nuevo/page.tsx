'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import ProductForm from '@/components/products/ProductForm';
import { Product } from '@/types/models/GeneralModels';
import { productService, ProductServiceError } from '@/services/productsService';
import { toast } from 'react-hot-toast';

export default function NewProductPage() {
  const searchParams = useSearchParams();
  const [isEditing, setIsEditing] = useState(false);
  const [productData, setProductData] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const editProduct = searchParams.get('edit');
    if (editProduct) {
      setIsEditing(true);
      fetchProductData(editProduct);
    }
  }, [searchParams]);

  const fetchProductData = async (productName: string) => {
    setIsLoading(true);
    try {
      const product = await productService.getProduct(productName);
      setProductData(product);
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

  return (
    <>
      <Header moduleName="Gestión de Productos" />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
          </h1>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <ProductForm initialData={productData} isEditing={isEditing} />
        )}
      </div>
    </>
  );
}