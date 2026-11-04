// Formateador de moneda en colones costarricenses
const formateadorMoneda = new Intl.NumberFormat('es-CR', {
  style: 'currency',
  currency: 'CRC',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const formatearMoneda = (monto: number): string => {
  return formateadorMoneda.format(monto);
};

// Formateador de fechas
export const formatearFecha = (fecha: string): string => {
  const date = new Date(fecha + 'T00:00:00');
  return date.toLocaleDateString('es-CR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Obtener mes y año actual
export const obtenerMesActual = (): number => {
  return new Date().getMonth();
};

export const obtenerAnioActual = (): number => {
  return new Date().getFullYear();
};

// Obtener nombre del mes
export const obtenerNombreMes = (mes: number): string => {
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return meses[mes];
};

// Categorías disponibles
export const CATEGORIAS = ['Comida', 'Transporte', 'Servicios', 'Estudio', 'Ocio'] as const;

// Iconos de categorías (Font Awesome)
export const CATEGORIA_ICONS: Record<string, string> = {
  Comida: 'fa-utensils',
  Transporte: 'fa-bus',
  Servicios: 'fa-lightbulb',
  Estudio: 'fa-book',
  Ocio: 'fa-gamepad',
};

// Icono por defecto si la categoría no existe
export const ICONO_DEFECTO = 'fa-coins';