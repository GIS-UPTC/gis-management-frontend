/**
 * Servicio para manejar transformaciones de fechas entre string y Date
 */

/**
 * Convierte una fecha en formato string a objeto Date
 * @param dateString - Fecha en formato ISO string
 * @returns Date object
 */
export const stringToDate = (dateString: string): Date => {
    return new Date(dateString);
};

/**
 * Convierte un objeto Date a string en formato ISO
 * @param date - Objeto Date
 * @returns string en formato ISO
 */
export const dateToString = (date: Date): string => {
    return date.toISOString();
};

/**
 * Valida si una fecha en formato string es válida
 * @param dateString - Fecha en formato string
 * @returns boolean indicando si la fecha es válida
 */
export const isValidDateString = (dateString: string): boolean => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
}; 