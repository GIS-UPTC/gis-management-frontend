import React from 'react';
import { useRouter } from 'next/navigation';
import { Progress } from '@/types/models/GeneralModels';
import { DocumentIcon, LinkIcon } from '@heroicons/react/24/outline';
import { progressService } from '@/services/progressesService';

interface ProgressTableProps {
    progresses: Progress[];
}

export default function ProgressTable({ progresses }: ProgressTableProps) {
    const router = useRouter();

    const progressTypes: Record<string, string> = {
        "PI": "Propuesta Inicial",
        "IO": "Informe Operativo o de Avance",
        "IF": "Informe Financiero",
        "FI": "Informe Final"
    };

    const handleRowClick = (progress: Progress) => {
        // Use project and user information to create a unique identifier
        const encodedName = encodeURIComponent(`${progress.project.title}_${progress.id}`);
        router.push(`/progresses/${encodedName}`);
    };

    const handleDeleteProgress = async (progress: Progress, e: React.MouseEvent) => {
        e.stopPropagation(); // Evita que se active el click de la fila

        try {
            const results = await progressService.deleteProgress(progress.id);
            window.location.reload();

        } catch (error) {
            console.error('Error eliminando progreso:', error);
            alert('Error al eliminar progreso');
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString();
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
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Proyecto</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Usuario</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Tipo</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Fecha</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Documento</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Eliminar progreso</th>
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
                                {truncateText(progress.project.title, 30)}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                                {progress.user.first_name} {progress.user.surname}
                            </td>
                            <td className="px-6 py-4 text-sm">
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
                            <td className="px-6 py-4 text-sm">
                                <button
                                    onClick={(e) => handleDeleteProgress(progress, e)}
                                    className={`px-3 py-1 rounded-md text-sm font-medium 'bg-red-100 text-red-700 hover:bg-red-200'`}
                                >
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}