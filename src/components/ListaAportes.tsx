import { Edit2, Trash2 } from 'lucide-react';
import type { Aporte } from '../utils/storage';

interface Props {
  aportes: Aporte[];
  onEditar: (aporteId: string) => void;
  onEliminar: (aporteId: string) => void;
}

const ListaAportes = ({ aportes, onEditar, onEliminar }: Props) => {
  if (aportes.length === 0) {
    return (
      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
        No hay aportes registrados para esta meta.
      </p>
    );
  }

  return (
    <div className="aportes-list">
      <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>
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
              onClick={() => onEditar(aporte.id)}
              title="Editar aporte"
              aria-label="Editar aporte"
            >
              <Edit2 size={13} />
            </button>
            <button
              className="btn btn-danger btn-icon"
              onClick={() => onEliminar(aporte.id)}
              title="Eliminar aporte"
              aria-label="Eliminar aporte"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListaAportes;