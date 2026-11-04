import { formatearMoneda, formatearFecha } from '../utils/formatters';
import BarraProgreso from './BarraProgreso';
import FormularioAporte from './FormularioAporte';
import type { Meta, Aporte } from '../utils/storage';

interface Props {
  meta: Meta;
  onEditar: (meta: Meta) => void;
  onEliminar: (id: string) => void;
  onAgregarAporte: (metaId: string, aporte: Omit<Aporte, 'id'>) => void;
  onEditarAporte: (metaId: string, aporteId: string, aporte: Omit<Aporte, 'id'>) => void;
  onEliminarAporte: (metaId: string, aporteId: string) => void;
}

const MetaAhorro = ({ meta, onEditar, onEliminar, onAgregarAporte, onEditarAporte, onEliminarAporte }: Props) => {
  const { id, nombre, montoObjetivo, fechaLimite, aportes } = meta;

  // Calcular monto ahorrado usando reduce()
  const montoAhorrado = aportes.reduce((acc, aporte) => acc + aporte.monto, 0);
  const porcentaje = montoObjetivo > 0 ? (montoAhorrado / montoObjetivo) * 100 : 0;
  const fechaLimiteDate = new Date(fechaLimite + 'T00:00:00');
  const esVencida = fechaLimiteDate < new Date() && porcentaje < 100;

  return (
    <article className={`meta-card ${esVencida ? 'limit-warning' : ''}`}>
      <div className="meta-header">
        <div>
          <h3>{nombre}</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
            Fecha límite: {formatearFecha(fechaLimite)}
            {esVencida && <span style={{ color: 'var(--color-danger)', marginLeft: '0.5rem' }}>  <i className="fa-solid fa-triangle-exclamation"></i> Vencida</span>}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button className="btn btn-outline btn-sm" onClick={() => onEditar(meta)} title="Editar meta">
            Editar
          </button>
          <button className="btn btn-danger btn-sm" onClick={() => onEliminar(id)} title="Eliminar meta">
            Eliminar
          </button>
        </div>
      </div>

      <BarraProgreso porcentaje={porcentaje} />

      <div className="meta-stats">
        <div>
          Ahorrado: <span>{formatearMoneda(montoAhorrado)}</span>
        </div>
        <div>
          Objetivo: <span>{formatearMoneda(montoObjetivo)}</span>
        </div>
        <div>
          Progreso: <span>{porcentaje.toFixed(1)}%</span>
        </div>
      </div>

      <FormularioAporte
        metaId={id}
        aportes={aportes}
        onAgregar={onAgregarAporte}
        onEditar={onEditarAporte}
        onEliminar={onEliminarAporte}
      />
    </article>
  );
};

export default MetaAhorro;