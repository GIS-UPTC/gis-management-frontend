import React from 'react';
import { useRouter } from 'next/navigation';
import { Progress } from '@/types/models/GeneralModels';
import { LinkIcon } from '@heroicons/react/24/outline';
import { progressService } from '@/services/progressesService';
import { FaTrash } from 'react-icons/fa';
import { capitalizeFirstLetter, formatUserFullName } from '@/utils/stringUtils';

interface ProgressTableProps {
    progresses: Progress[];
}

export default function ProgressTable({ progresses }: ProgressTableProps) {
    const router = useRouter();

    const progressTypes: Record<string, string> = {
        "PI": "Propuesta Inicial",
        "IO": "Informe Operativo",
        "IF": "Informe Financiero",
        "FI": "Informe Final"
    };

    const projectStatus: Record<string, string> = {
        "AC": "Activo",
        "IN": "Inactivo",
        "EJ": "En ejecución",
        "CN": "Cancelado",
        "FN": "Finalizado"
    };

    const handleRowClick = (progress: Progress) => {
        // Use project and user information to create a unique identifier
        const encodedName = encodeURIComponent(`${progress.project.title}`);
        const encodedId = encodeURIComponent(`${progress.id}`);
        router.push(`/avances/${encodedName}?id=${encodedId}`);
    };

    const handleDeleteProgress = async (progress: Progress, e: React.MouseEvent) => {
        e.stopPropagation(); // Evita que se active el click de la fila

        try {
            await progressService.deleteProgress(progress.id);
            window.location.reload();

        } catch (error) {
            console.error('Error eliminando progreso:', error);
            alert('Error al eliminar progreso');
        }
    };

    const formatDate = (dateString: string | null): string => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);

        return date.toLocaleString('es-ES', {
            dateStyle: 'short',
            timeStyle: 'short'
        });
    };

    const truncateText = (text: string | null, maxLength: number) => {
        if (!text) return 'N/A';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
                <thead className="bg-yellow-200">
                    <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Proyecto asociado</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Estado proyecto</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Usuario que reporta</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Tipo de avance</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Fecha y hora</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Documento adjunto</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Descripción avance</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Eliminar avance</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {progresses.map((progress) => (
                        <tr
                            key={progress.id}
                            onClick={() => handleRowClick(progress)}
                            className="cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                            <td className="px-6 py-4 text-sm text-gray-900">
                                {capitalizeFirstLetter(truncateText(progress.project.title, 30))}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                                <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-green-200 text-green-800">
                                    {projectStatus[progress.project.status] || progress.project.status}
                                </span>

                            </td>
                            <td className="px-6 py-4 text-sm">
                                {formatUserFullName(progress.user)}

                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                                <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-orange-200 text-orange-800">
                                    {progressTypes[progress.type] || progress.type}
                                </span>

                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                                {formatDate(progress.date)}
                            </td>
                            <td className="px-6 py-4 text-sm">
                                {progress.document_link ? (
                                    <span className="inline-flex items-center text-blue-600">
                                        <LinkIcon className="h-4 w-4 mr-1" />
                                        Enlace
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center text-green-600">
                                        No hay documento
                                    </span>
                                )}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                                {progress.description ? (
                                    progress.description
                                ) : (
                                    'No hay descripción'
                                )}
                            </td>
                            <td className="px-6 py-4 text-sm">
                                <button
                                    onClick={(e) => {
                                        handleDeleteProgress(progress, e)
                                    }}
                                    className="px-3 py-1 rounded-md text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200"
                                    title="Eliminar avance"
                                >
                                    <FaTrash className="inline mr-1" size={14} /> Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}