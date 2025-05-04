import React, { useState, useEffect } from 'react';
import { Product, Type } from '@/types/models/GeneralModels';
import { Project } from '@/types/models/project.models';
import { productService } from '@/services/productsService';
import { toast, Toaster } from 'react-hot-toast';
import SearchBar from '@/components/ui/SearchBar';
import { projectService } from '@/services/projectService';
import SelectionCard from '../progresses/components/SelectionCard';

interface FormData extends Omit<Product, 'id'> {
  file?: File | null;
}

const initialFormData: FormData = {
  code: '',
  name: '',
  description: '',
  type: {
    id: null,
    name: '',
    subtype_id: null,
    subtype_name: null
  },
  project: undefined,
  url: '',
  complementary_information: null,
  project_id: 0,
  file: null
};

interface ProductFormProps {
  initialData?: Product | null;
  isEditing?: boolean;
}

export default function ProductForm({
  initialData,
  isEditing = false
}: ProductFormProps) {
  const [formData, setFormData] = useState<FormData>(initialData || initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSearchingProject, setIsSearchingProject] = useState(false);
  const [projectResults, setProjectResults] = useState<Project[]>([]);
  const [productTypes, setProductTypes] = useState<Type[]>([]);
  const [subtypes, setSubtypes] = useState<Type[]>([]);

  const [projectSelected, setProjectSelected] = useState<Project | null>(null);

  const [isSearchingProductType, setIsSearchingProductType] = useState(false);

  // Buscar tipos de productos
  const searchProductTypes = async (query: string) => {
    if (query.length < 3) return;

    setIsSearchingProductType(true);
    try {
      const typeData = await productService.fetchProductTypes(query);
      // Si la respuesta es un solo tipo, lo convertimos en un array
      const typeArray = Array.isArray(typeData) ? typeData : [typeData];
      setProductTypes(typeArray);

      // Extraer subtipos si existen
      const subtypesData = typeArray.flatMap(type => {
        if (type.subtype_id && type.subtype_name) {
          return [{
            id: type.subtype_id,
            name: type.subtype_name,
            subtype_id: type.id,
            subtype_name: type.name
          }];
        }
        return [];
      });

      setSubtypes(subtypesData);
    } catch (error) {
      console.error('Error buscando tipos de productos:', error);
      toast.error('Error al buscar tipos de productos');
    } finally {
      setIsSearchingProductType(false);
    }
  };

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleSubtypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subtypeId = parseInt(e.target.value);
    const selectedSubtype = subtypes.find(subtype => subtype.id === subtypeId);

    if (selectedSubtype) {
      setFormData(prev => ({
        ...prev,
        type: {
          ...prev.type,
          subtype_id: selectedSubtype.id,
          subtype_name: selectedSubtype.name
        }
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSearchProjects = async (query: string) => {
    if (query.length < 3) return;

    setIsSearchingProject(true);
    try {
      const results = await projectService.searchProjects(query);
      setProjectResults(results);
    } catch (error) {
      console.error('Error buscando proyectos:', error);
      toast.error('Error al buscar proyectos');
    } finally {
      setIsSearchingProject(false);
    }
  };

  const clearProjectSelection = () => {
    setProjectSelected(null);
    setProjectResults([]);
    setFormData(prev => ({
      ...prev,
      project: undefined,
      project_id: 0
    }));
  };

  const handleProjectSelect = (project: Project) => {
    setProjectSelected(project)

    setFormData(prev => ({
      ...prev,
      project: project,
      project_id: project.id
    }));
    toast.success(`Proyecto "${project.title}" seleccionado`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!formData.code.trim()) {
      toast.error('El código del producto es obligatorio');
      return;
    }

    if (!formData.name.trim()) {
      toast.error('El nombre del producto es obligatorio');
      return;
    }

    if (!formData.type.name) {
      toast.error('El tipo de producto es obligatorio');
      return;
    }

    if (!formData.project_id) {
      toast.error('Debe seleccionar un proyecto');
      return;
    }

    if (!selectedFile && !isEditing) {
      toast.error('Debe seleccionar un archivo');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const productData: Omit<Product, 'id'> = {
        code: formData.code.trim(),
        name: formData.name.trim(),
        description: formData.description.trim(),
        type: formData.type,
        project: formData.project,
        url: formData.url.trim(),
        complementary_information: formData.complementary_information,
        project_id: formData.project_id
      };

      if (isEditing) {
        await productService.updateProduct(formData.code, productData as Product);
        toast.success('Producto actualizado exitosamente');
      } else {
        if (selectedFile) {
          await productService.createProduct(selectedFile, productData);
          toast.success('Producto creado exitosamente');
        }
      }

      window.location.href = '/productos';
    } catch (error) {
      console.error('Error guardando producto:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al guardar el producto';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtrar subtipos basados en el tipo seleccionado
  const filteredSubtypes = subtypes.filter(
    subtype => formData.type.id && subtype.subtype_id === formData.type.id
  );

  return (
    <form onSubmit={handleSubmit} className="bg-customLightYellow rounded-lg shadow max-w-4xl mx-auto p-6">
      <Toaster position="top-center" />
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Código del Producto *
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
              disabled={isEditing}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Producto *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Producto *
            </label>
            <div className="mb-2">
              <SearchBar
                onSearch={searchProductTypes}
                isLoading={isSearchingProductType}
                placeholder="Buscar tipo de producto..."
              />
            </div>
            {productTypes.length > 0 && (
              <div className="mt-2 border rounded-lg divide-y">
                <p className="p-2 bg-gray-50 text-sm font-medium">Seleccione un tipo de producto:</p>
                {productTypes.map(type => (
                  <div
                    key={type.id}
                    className={`p-3 cursor-pointer transition-colors ${formData.type.id === type.id ? 'bg-orange-100 border-l-4 border-orange-500' : 'hover:bg-orange-50'}`}
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        type: type
                      }));
                      toast.success(`Tipo "${type.name}" seleccionado`);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{type.name}</p>
                      {formData.type.id === type.id && (
                        <span className="text-orange-500 font-medium text-sm">Seleccionado</span>
                      )}
                    </div>
                    {type.subtype_name && (
                      <p className="text-xs text-gray-500 mt-1">Subtipo disponible: {type.subtype_name}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subtipo
            </label>
            <select
              name="subtype"
              value={formData.type.subtype_id || ''}
              onChange={handleSubtypeChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              disabled={!formData.type.id}
            >
              <option value="">Seleccione un subtipo</option>
              {filteredSubtypes.map(subtype => (
                <option key={subtype.id} value={subtype.id || ''}>
                  {subtype.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Información Complementaria
          </label>
          <textarea
            name="complementary_information"
            value={formData.complementary_information || ''}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="mb-4 relative">
          <label className="block mb-2 font-medium">Proyecto</label>
          {!projectSelected ? (
            <>
              <div onClick={(e) => e.stopPropagation()}>
                <SearchBar
                  onSearch={handleSearchProjects}
                  isLoading={isSearchingProject}
                  placeholder="Buscar proyecto por título..."
                />
              </div>

              {projectResults.length > 0 && (
                <div className="absolute mt-1 w-full z-10 bg-white border rounded-md shadow-lg max-h-60 overflow-auto" onClick={(e) => e.stopPropagation()}>
                  {projectResults.map((project) => (
                    <div
                      key={project.id}
                      className="p-3 hover:bg-orange-100 cursor-pointer border-b"
                      onClick={() => handleProjectSelect(project)}
                    >
                      <div className="font-medium">{project.title}</div>
                      <div className="text-sm text-gray-500">ID: {project.id}</div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <SelectionCard
              item={projectSelected}
              type="project"
              onClear={clearProjectSelection}
            />
          )}
        </div>

        {!isEditing && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar archivo <span className="text-red-500">*pdf</span>
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required={!isEditing}
              accept=".pdf"
            />
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200"
            onClick={() => window.history.back()}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </form>
  );
}
