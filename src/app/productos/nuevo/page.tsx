'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import ProductForm from '@/components/products/ProductForm';
import { Product } from '@/types/models/GeneralModels';
import { productService, ProductServiceError } from '@/services/productsService';
import { toast, Toaster } from 'react-hot-toast';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { checkUserPermission, AVAILABLE_PERMISSIONS } from '@/utils/permissionChecker';

export default function NewProductPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [productData, setProductData] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    // Verificar permisos del usuario
    const checkPermissions = () => {
      const editProduct = searchParams.get('edit');
      const requiredPermission = editProduct ? AVAILABLE_PERMISSIONS.EDIT : AVAILABLE_PERMISSIONS.CREATE;
      
      const hasRequiredPermission = checkUserPermission(requiredPermission);
      setHasPermission(hasRequiredPermission);
      
      if (!hasRequiredPermission) {
        toast.error('No tienes permiso para ' + (editProduct ? 'editar' : 'crear') + ' productos');
        router.push('/productos');
        return;
      }
      
      if (editProduct) {
        setIsEditing(true);
        fetchProductData(editProduct);
      }
    };
    
    checkPermissions();
  }, [searchParams, router]);

  const fetchProductData = async (productName: string) => {
    setIsLoading(true);
    try {
      const product = await productService.searchProducts(productName);
      setProductData(product[0]);
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
      <Toaster position="top-center" />
      <Header moduleName="Productos" />
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link href="/productos" className="mr-4">
            <ArrowLeftIcon className="h-8 w-8 text-black hover:text-orange-600" />
          </Link>
          <h1 className="text-2xl font-bold">
            {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
          </h1>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : hasPermission ? (
          <ProductForm initialData={productData} isEditing={isEditing} />
        ) : (
          <div className="text-center py-8 text-red-500">
            No tienes permiso para {isEditing ? 'editar' : 'crear'} productos
          </div>
        )}
      </div>
    </>
  );
}