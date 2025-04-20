import { Place, Program } from "@/types/models/GeneralModels";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface DialogAddProgramProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (program: Program) => void;
}

export default function DialogAddProgram({
    isOpen,
    onClose,
    onSave,
}: DialogAddProgramProps) {
    // Estado interno del formulario
    const [name, setName] = useState("");
    const [isDiurn, setIsDiurn] = useState(false);

    // Facultad
    const [facultyName, setFacultyName] = useState("");
    const [facultyPlaceIsNull, setFacultyPlaceIsNull] = useState(true);
    const [facultyPlace, setFacultyPlace] = useState<Place>({ id: 0, name: "", place_id: null, place_name: null });

    // Universidad
    const [uniId, setUniId] = useState<number>(0);
    const [uniName, setUniName] = useState("");
    const [uniPlace, setUniPlace] = useState<Place>({ id: 0, name: "", place_id: null, place_name: null });

    function handleSave(e: React.FormEvent) {
        e.preventDefault();
        
        const newProgram: Program = {
            id: 0,
            name,
            is_diurn: isDiurn,
            faculty: {
                id: 0,
                name: facultyName,
                university: {
                    id: uniId,
                    name: uniName,
                    place: uniPlace,
                },
                place: facultyPlaceIsNull ? null : facultyPlace,
            },
        };
        onSave(newProgram);
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg max-h-[90vh] flex flex-col">
                <div className="p-5 border-b">
                    <h2 className="text-xl font-semibold">Añadir Programa Académico</h2>
                </div>

                <form onSubmit={handleSave} className="flex flex-col flex-grow">
                    <div className="overflow-y-auto p-5 flex-grow">
                        <div className="space-y-4">
                            {/* Información del Programa */}
                            <div className="mb-6">
                                <h3 className="font-medium text-gray-700 mb-3">Información General</h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nombre del Programa *
                                        </label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Ej: Ingeniería de Sistemas"
                                            className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            required
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            id="is_diurn"
                                            type="checkbox"
                                            checked={isDiurn}
                                            onChange={(e) => setIsDiurn(e.target.checked)}
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="is_diurn" className="ml-2 block text-sm text-gray-700">
                                            Horario Diurno
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Información de la Facultad */}
                            <div className="mb-6">
                                <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                                    <span>Información de la Facultad</span>
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nombre de la Facultad *
                                        </label>
                                        <input
                                            type="text"
                                            value={facultyName}
                                            onChange={(e) => setFacultyName(e.target.value)}
                                            placeholder="Ej: Facultad de Ingeniería"
                                            className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            required
                                        />
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            id="faculty_place_null"
                                            type="checkbox"
                                            checked={facultyPlaceIsNull}
                                            onChange={(e) => setFacultyPlaceIsNull(e.target.checked)}
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="faculty_place_null" className="ml-2 block text-sm text-gray-700">
                                            Sin ubicación específica
                                        </label>
                                    </div>

                                    {!facultyPlaceIsNull && (
                                        <div className="space-y-3 pl-4 border-l-2 border-gray-200 mt-2">
                                            <h4 className="text-sm font-medium text-gray-700">Ubicación de la Facultad</h4>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-1">
                                                        Nombre del lugar *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="Nombre de la ubicación"
                                                        value={facultyPlace.name}
                                                        onChange={(e) => setFacultyPlace({ ...facultyPlace, name: e.target.value })}
                                                        className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                        required={!facultyPlaceIsNull}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-1">
                                                        Nombre referencial
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="Nombre referencial del lugar"
                                                        value={facultyPlace.place_name || ''}
                                                        onChange={(e) => setFacultyPlace({ ...facultyPlace, place_name: e.target.value })}
                                                        className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Información de la Universidad */}
                            <div>
                                <h3 className="font-medium text-gray-700 mb-3">Información de la Universidad</h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nombre *
                                        </label>
                                        <input
                                            type="text"
                                            value={uniName}
                                            onChange={(e) => setUniName(e.target.value)}
                                            placeholder="Ej: Universidad Nacional"
                                            className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            required
                                        />
                                    </div>

                                    <div className="mt-3">
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">Ubicación de la Universidad</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">
                                                    Nombre del lugar *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={uniPlace.name}
                                                    onChange={(e) => setUniPlace({ ...uniPlace, name: e.target.value })}
                                                    placeholder="Nombre de la ubicación"
                                                    className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">
                                                    Nombre referencial
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Nombre referencial del lugar"
                                                    value={uniPlace.place_name || ''}
                                                    onChange={(e) => setUniPlace({ ...uniPlace, place_name: e.target.value })}
                                                    className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 border-t flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm font-medium"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
                        >
                            Guardar Programa
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}