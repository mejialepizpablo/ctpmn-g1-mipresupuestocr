
export interface ErroresMovimiento {
  tipo?: string;
  monto?: string;
  fecha?: string;
  categoria?: string;
  descripcion?: string;
}

export const validarMovimiento = (data: {
  tipo: string;
  monto: string;
  fecha: string;
  categoria: string;
  descripcion: string;
}): ErroresMovimiento => {
  const errores: ErroresMovimiento = {};

  if (!data.tipo) {
    errores.tipo = 'Debe seleccionar un tipo (ingreso o gasto).';
  }

  if (!data.monto || data.monto.trim() === '') {
    errores.monto = 'El monto es obligatorio.';
  } else if (isNaN(Number(data.monto)) || Number(data.monto) <= 0) {
    errores.monto = 'El monto debe ser un número mayor que cero.';
  }

  if (!data.fecha) {
    errores.fecha = 'La fecha es obligatoria.';
  }

  if (!data.categoria) {
    errores.categoria = 'Debe seleccionar una categoría.';
  }

  if (!data.descripcion || data.descripcion.trim().length < 3) {
    errores.descripcion = 'La descripción debe tener al menos 3 caracteres.';
  } else if (data.descripcion.trim().length > 100) {
    errores.descripcion = 'La descripción no puede superar los 100 caracteres.';
  }

  return errores;
};

export interface ErroresMeta {
  nombre?: string;
  montoObjetivo?: string;
  fechaLimite?: string;
}

export const validarMeta = (data: {
  nombre: string;
  montoObjetivo: string;
  fechaLimite: string;
}): ErroresMeta => {
  const errores: ErroresMeta = {};

  if (!data.nombre || data.nombre.trim().length < 3) {
    errores.nombre = 'El nombre debe tener al menos 3 caracteres.';
  }

  if (!data.montoObjetivo || data.montoObjetivo.trim() === '') {
    errores.montoObjetivo = 'El monto objetivo es obligatorio.';
  } else if (
    isNaN(Number(data.montoObjetivo)) ||
    Number(data.montoObjetivo) <= 0
  ) {
    errores.montoObjetivo = 'El monto debe ser un número mayor que cero.';
  }

  if (!data.fechaLimite) {
    errores.fechaLimite = 'La fecha límite es obligatoria.';
  }

  return errores;
};

export interface ErroresAporte {
  monto?: string;
  fecha?: string;
}

export const validarAporte = (data: {
  monto: string;
  fecha: string;
}): ErroresAporte => {
  const errores: ErroresAporte = {};

  if (!data.monto || data.monto.trim() === '') {
    errores.monto = 'El monto es obligatorio.';
  } else if (isNaN(Number(data.monto)) || Number(data.monto) <= 0) {
    errores.monto = 'El monto debe ser un número mayor que cero.';
  }

  if (!data.fecha) {
    errores.fecha = 'La fecha es obligatoria.';
  }

  return errores;
};
