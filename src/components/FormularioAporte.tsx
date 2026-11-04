import { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, X } from 'lucide-react';
import { validarAporte, ErroresAporte } from '../utils/validaciones';
import type { Aporte } from '../utils/storage';

interface Props {
  metaId: string;
  aportes: Aporte[];
  onAgregar: (metaId: string, aporte: Omit<Aporte, 'id'>) => void;
  onEditar: (metaId: string, aporteId: string, aporte: Omit<Aporte, 'id'>) => void;
  onEliminar: (metaId: string, aporteId: string) => void;
}

const FormularioAporte = ({ metaId, aportes, onAgregar, onEditar, onEliminar }: Props) => {
  const [mostrar, setMostrar] = useState(false);
  const [monto, setMonto] = useState('');
  const [fecha, setFecha] = useState('');
  const [errores, setErrores] = useState<ErroresAporte>({});
  const [editandoId, setEditandoId] = useState<string | null>(null);

  useEffect(() => {
    if (editandoId) {
      const aporte = aportes.find((a) => a.id === editandoId);
      if (aporte) {
        setMonto(String(aporte.monto));
        setFecha(aporte.fecha);
        setMostrar(true);
      }
    }
  }, [editandoId, aportes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { monto, fecha };
    const erroresValidacion = validarAporte(data);

    if (Object.keys(erroresValidacion).length > 0) {
      setErrores(erroresValidacion);
      return;
    }

    if (editandoId) {
      onEditar(metaId, editandoId, { monto: Number(monto), fecha });
      setEditandoId(null);
    } else {
      onAgregar(metaId, { monto: Number(monto), fecha });
    }

    setMonto('');
    setFecha('');
    setErrores({});
    setMostrar(false);
  };

  const handleEditar = (aporteId: string) => {
    setEditandoId(aporteId);
  };

  const handleCancelar = () => {
    setMonto('');
    setFecha('');
    setErrores({});
    setEditandoId(null);
    setMostrar(false);
  };

  return (
    <div>
      {!mostrar && (
        <button className="btn btn-success btn-sm" onClick={() => setMostrar(true)}>
          <Plus size={14} />
          Agregar aporte
        </button>
      )}

      {mostrar && (
        <form onSubmit={handleSubmit} style={{ marginTop: '0.75rem' }}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor={`aporte-monto-${metaId}`}>Monto (₡)</label>
              <input
                id={`aporte-monto-${metaId}`}
                type="number"
                placeholder="Ej: 10000"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
              />
              {errores.monto && <p className="form-error">{errores.monto}</p>}
            </div>
            <div className="form-group">
              <label htmlFor={`aporte-fecha-${metaId}`}>Fecha</label>
              <input
                id={`aporte-fecha-${metaId}`}
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
              />
              {errores.fecha && <p className="form-error">{errores.fecha}</p>}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" className="btn btn-success btn-sm">
              {editandoId ? 'Actualizar' : 'Agregar'}
            </button>
            <button type="button" className="btn btn-outline btn-sm" onClick={handleCancelar}>
              <X size={14} />
              Cancelar
            </button>
          </div>
        </form>
      )}

      {aportes.length > 0 && (
        <div className="aportes-list">
          <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem', marginTop: '1rem' }}>
            Historial de aportes ({aportes.length})
          </h4>
          {aportes.map((aporte) => (
            <div key={aporte.id} className="aporte-item">
              <div className="aporte-info">
                <span className="aporte-amount">+₡{aporte.monto.toLocaleString('es-CR')}</span>
                <span className="aporte-date">
                  {new Date(aporte.fecha + 'T00:00:00').toLocaleDateString('es-CR')}
                </span>
              </div>
              <div className="aporte-actions">
                <button
                  className="btn btn-outline btn-icon"
                  onClick={() => handleEditar(aporte.id)}
                  title="Editar aporte"
                  aria-label="Editar aporte"
                >
                  <Edit2 size={13} />
                </button>
                <button
                  className="btn btn-danger btn-icon"
                  onClick={() => onEliminar(metaId, aporte.id)}
                  title="Eliminar aporte"
                  aria-label="Eliminar aporte"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FormularioAporte;