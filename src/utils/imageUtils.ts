/**
 * Utilidades para el manejo de imágenes
 */

/**
 * Convierte una URL de Google Drive en una URL utilizable para mostrar imágenes
 * Las URLs de Google Drive públicas tienen el formato:
 * https://drive.google.com/file/d/{fileId}/view?usp=sharing
 * o
 * https://drive.google.com/open?id={fileId}
 * 
 * @param url URL de Google Drive o cualquier otra URL de imagen
 * @returns URL transformada para mostrar la imagen o la URL original si no es de Google Drive
 */
export const getImageUrl = (url: string | null | undefined): string => {
  if (!url) {
    return "https://cdn-icons-png.flaticon.com/512/149/149071.png"; // Imagen por defecto
  }

  try {
    // Verificar si es una URL de Google Drive
    if (url.includes('drive.google.com/file/d/')) {
      // Extraer el ID del archivo de la URL
      const fileId = url.split('/file/d/')[1].split('/')[0];
      if (fileId) {
        // Usar la URL de contenido directo
        return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
      }
    }

    // Verificar si es una URL de Google Drive en formato 'open'
    if (url.includes('drive.google.com/open?id=')) {
      // Extraer el ID del archivo de la URL
      const fileId = url.split('open?id=')[1].split('&')[0];
      if (fileId) {
        // Usar la URL de contenido directo
        return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
      }
    }
  } catch (error) {
    console.error('Error al procesar la URL de la imagen:', error);
    return "https://cdn-icons-png.flaticon.com/512/149/149071.png"; // Imagen por defecto en caso de error
  }

  // Si no es una URL de Google Drive o no se pudo extraer el ID, devolver la URL original
  return url;
};
