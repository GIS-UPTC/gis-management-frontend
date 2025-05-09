// Utilidad para rastrear la posición del mouse y guardarla como variables CSS

export const initMousePositionTracking = () => {
  if (typeof window !== 'undefined') {
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Inicializar con valores por defecto
    document.documentElement.style.setProperty('--mouse-x', '0px');
    document.documentElement.style.setProperty('--mouse-y', '0px');

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }
  return () => {};
};
