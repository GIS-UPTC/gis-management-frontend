// services/productService.ts
import { handleApiError, ServiceError } from '@/utils/errorHandler';
import api from './api';
import { Product, Type } from '@/types/models/GeneralModels';

export class ProductServiceError extends ServiceError {
  constructor(message: string) {
    super(message, 'ProductServiceError');
  }
}

const formattedProductData = (jsonData: Omit<Product, 'id'>) => ({
  code: jsonData.code,
  name: jsonData.name,
  description: jsonData.description,
  type: {
    name: jsonData.type.name,

    ...(jsonData.type.id? { id: jsonData.type.id } : {}),
    ...(jsonData.type.subtype_id? { subtype_id: jsonData.type.subtype_id } : {}),
    ...(jsonData.type.subtype_name? { subtype_name: jsonData.type.subtype_name } : {})
  },
  project_id: jsonData.project_id,

  ...(jsonData.complementary_information ? { complementary_information: jsonData.complementary_information } : {})
});

export const productService = {
  async createProduct(file: File, jsonData: Omit<Product, 'id'>): Promise<Product> {
    try {

      const formattedData = formattedProductData(jsonData);

      console.log(formattedData)

      const formData = new FormData();

      if (file) {
        formData.append('file', file);
      }else{
        throw new Error('No se puede crear un producto sin seleccionar un archivo');
      }

      formData.append('json_data', JSON.stringify(formattedData));

      const response = await api.post<Product>(`/products/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return handleApiError(
        error,
        ProductServiceError,
        'Error al crear el producto. Por favor, intente nuevamente.'
      );
    }
  },

  async getProducts(name: string): Promise<Product[]> {
    try {
      const response = await api.get<Product[]>(`/products/${name}`);
      return response.data;
    } catch (error) {
      return handleApiError(
        error,
        ProductServiceError,
        'Error al obtener el producto. Por favor, intente nuevamente.'
      );
    }
  },

  async deleteProduct(code: string): Promise<void> {
    try {
      await api.delete(`/products/${code}`);
    } catch (error) {
      return handleApiError(
        error,
        ProductServiceError,
        'Error al eliminar el producto. Por favor, intente nuevamente.'
      );
    }
  },

  async updateProduct(code: string, productData: Product): Promise<Product> {
    try {
      const formattedData = formattedProductData(productData);
      const response = await api.put<Product>(`/products/${code}`, formattedData);
      return response.data;
    } catch (error) {
      return handleApiError(
        error,
        ProductServiceError,
        'Error al actualizar el producto. Por favor, intente nuevamente.'
      );
    }
  },

  async fetchProductTypes(name: string): Promise<Type[]> {
    try {
      const response = await api.get<Type[]>(`/product_types/${name}`);
      console.log(response)
      return response.data;
    } catch (error) {
      return handleApiError(
        error,
        ProductServiceError,
        'Error al buscar tipos de producto. Por favor, intente nuevamente.'
      );
    }
  },

  async fetchProductSubtypes(name: string): Promise<Type[]> {
    try {
      // Utilizamos el mismo endpoint pero filtramos por subtipos
      const response = await api.get<Type[]>(`/product_types/${name}/`);
      return response.data;
    } catch (error) {
      return handleApiError(
        error,
        ProductServiceError,
        'Error al buscar subtipos de producto. Por favor, intente nuevamente.'
      );
    }
  },
};