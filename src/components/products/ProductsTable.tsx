import React, { useState } from 'react';
import { Product } from '@/types/models/GeneralModels';
import { FaTrash } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { capitalizeFirstLetter } from '@/utils/stringUtils';
import ConfirmationDialog from '../common/ConfirmationDialog';

interface ProductsTableProps {
  products: Product[];
  onDelete?: (code: string) => void;
}

export default function ProductsTable({ products, onDelete }: ProductsTableProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const handleRowClick = (product: Product) => {
    const encodedName = encodeURIComponent(product.name);
    router.push(`/productos/${encodedName}`);
  };

  const handleDeleteClick = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (productToDelete && onDelete) {
      onDelete(productToDelete.code);
    }
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-yellow-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Código</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Nombre</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Tipo</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Subtipo</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Proyecto</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr
                key={product.code}
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleRowClick(product)}
              >
                <td className="px-6 py-4 text-sm text-gray-900">
                  {product.code}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {capitalizeFirstLetter(product.name)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {capitalizeFirstLetter(product.type.name)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {product.type.subtype_name || 'N/A'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {capitalizeFirstLetter(product.project?.title || 'N/A')}
                </td>
                <td className="px-6 py-4 text-sm">
                  {onDelete && (
                    <button
                      onClick={(e) => handleDeleteClick(product, e)}
                      className="px-3 py-1 rounded-md text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200"
                      title="Eliminar producto"
                    >
                      <FaTrash className="inline mr-1" size={14} /> Eliminar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Eliminar Producto"
        message="¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer."
      />
    </>
  );
}