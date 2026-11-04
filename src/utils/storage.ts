
// Claves de localStorage
const KEYS = {
  movimientos: 'mipresupuesto_movimientos',
  metas: 'mipresupuesto_metas',
  limites: 'mipresupuesto_limites',
};

// Tipos
export interface Movimiento {
  id: string;
  tipo: 'ingreso' | 'gasto';
  monto: number;
  fecha: string;
  categoria: string;
  descripcion: string;
}

export interface Aporte {
  id: string;
  monto: number;
  fecha: string;
}

export interface Meta {
  id: string;
  nombre: string;
  montoObjetivo: number;
  fechaLimite: string;
  aportes: Aporte[];
}

export interface Limites {
  [categoria: string]: number;
}

// Funciones genéricas
const leerDatos = <T>(key: string, defaultValue: T): T => {
  try {
    const data = localStorage.getItem(key);
    if (!data) return defaultValue;
    return JSON.parse(data) as T;
  } catch (error) {
    console.error('Error al leer de localStorage:', error);
    return defaultValue;
  }
};

export const EVENTO_DATOS_ACTUALIZADOS = 'mipresupuesto:datos-actualizados';

const guardarDatos = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));

    window.dispatchEvent(
      new Event(EVENTO_DATOS_ACTUALIZADOS)
    );
  } catch (error) {
    console.error('Error al guardar en localStorage:', error);
  }
};

// Movimientos
export const obtenerMovimientos = (): Movimiento[] => {
  return leerDatos<Movimiento[]>(KEYS.movimientos, []);
};

export const guardarMovimientos = (movimientos: Movimiento[]): void => {
  guardarDatos(KEYS.movimientos, movimientos);
};

// Metas
export const obtenerMetas = (): Meta[] => {
  return leerDatos<Meta[]>(KEYS.metas, []);
};

export const guardarMetas = (metas: Meta[]): void => {
  guardarDatos(KEYS.metas, metas);
};

// Límites
export const obtenerLimites = (): Limites => {
  return leerDatos<Limites>(KEYS.limites, {});
};

export const guardarLimites = (limites: Limites): void => {
  guardarDatos(KEYS.limites, limites);
};
