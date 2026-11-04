
import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { CATEGORIAS, formatearMoneda } from '../utils/formatters';
import {
  obtenerLimites,
  guardarLimites,
  obtenerMovimientos,
  EVENTO_DATOS_ACTUALIZADOS,
  type Limites,
  type Movimiento
} from '../utils/storage';

const ConfiguracionLimites = () => {
  const [limites, setLimites] = useState<Limites>({});
  const [editando, setEditando] = useState(false);
  const [tempLimites, setTempLimites] = useState<Limites>({});
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);

  useEffect(() => {
    const datos = obtenerLimites();

    setLimites(datos);
    setTempLimites(datos);
    setMovimientos(obtenerMovimientos());

    const actualizarMovimientos = () => {
      setMovimientos(obtenerMovimientos());
    };

    window.addEventListener(
      EVENTO_DATOS_ACTUALIZADOS,
      actualizarMovimientos
    );

    window.addEventListener('storage', actualizarMovimientos);

    return () => {
      window.removeEventListener(
        EVENTO_DATOS_ACTUALIZADOS,
        actualizarMovimientos
      );

      window.removeEventListener('storage', actualizarMovimientos);
    };
  }, []);

  const mesActual = new Date().getMonth();
  const anioActual = new Date().getFullYear();

  const gastosPorCategoria = CATEGORIAS.reduce((acc, cat) => {
    acc[cat] = movimientos
      .filter((m) => {
        const fecha = new Date(m.fecha + 'T00:00:00');

        return (
          m.tipo === 'gasto' &&
          m.categoria === cat &&
          fecha.getMonth() === mesActual &&
          fecha.getFullYear() === anioActual
        );
      })
      .reduce((sum, m) => sum + m.monto, 0);

    return acc;
  }, {} as Record<string, number>);

  const handleGuardar = () => {
    guardarLimites(tempLimites);
    setLimites(tempLimites);
    setEditando(false);
  };

  const handleCancelar = () => {
    setTempLimites(limites);
    setEditando(false);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Límites de gastos por categoría</h3>

        {!editando ? (
          <button
            className="btn btn-outline btn-sm"
            onClick={() => {
              setTempLimites(limites);
              setEditando(true);
            }}
          >
            Configurar
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className="btn btn-success btn-sm"
              onClick={handleGuardar}
            >
              Guardar
            </button>

            <button
              className="btn btn-outline btn-sm"
              onClick={handleCancelar}
            >
              Cancelar
            </button>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {CATEGORIAS.map((cat) => {
          const limite = limites[cat] || 0;
          const gasto = gastosPorCategoria[cat];
          const excedido = limite > 0 && gasto > limite;
          const cercaLimite =
            limite > 0 && gasto > limite * 0.8 && gasto <= limite;

          return (
            <div
              key={cat}
              className={`movimiento-item ${
                excedido
                  ? 'limit-exceeded'
                  : cercaLimite
                    ? 'limit-warning'
                    : ''
              }`}
              style={{ padding: '0.75rem 1rem' }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.25rem'
                  }}
                >
                  <strong style={{ fontSize: '0.9rem' }}>
                    {cat}
                  </strong>

                  {excedido && (
                    <span
                      className="alert alert-danger"
                      style={{
                        padding: '0.15rem 0.5rem',
                        margin: 0,
                        fontSize: '0.75rem'
                      }}
                    >
                      <AlertTriangle size={12} /> Límite excedido
                    </span>
                  )}

                  {cercaLimite && (
                    <span
                      className="alert alert-warning"
                      style={{
                        padding: '0.15rem 0.5rem',
                        margin: 0,
                        fontSize: '0.75rem'
                      }}
                    >
                      <AlertTriangle size={12} /> Cerca del límite
                    </span>
                  )}
                </div>

                <div
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--color-text-secondary)'
                  }}
                >
                  Gastado: {formatearMoneda(gasto)}
                  {limite > 0 && (
                    <> / Límite: {formatearMoneda(limite)}</>
                  )}
                </div>
              </div>

              {editando && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <label
                    htmlFor={`limite-${cat}`}
                    style={{ fontSize: '0.8rem', fontWeight: 500 }}
                  >
                    ₡
                  </label>

                  <input
                    id={`limite-${cat}`}
                    type="number"
                    min="0"
                    placeholder="Sin límite"
                    value={tempLimites[cat] || ''}
                    onChange={(e) =>
                      setTempLimites({
                        ...tempLimites,
                        [cat]: Number(e.target.value) || 0
                      })
                    }
                    style={{
                      width: '120px',
                      padding: '0.4rem 0.6rem',
                      fontSize: '0.85rem',
                      border: '1.5px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)'
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConfiguracionLimites;
