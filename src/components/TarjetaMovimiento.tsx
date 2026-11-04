import { Edit2, Trash2 } from 'lucide-react';
import { formatearMoneda, formatearFecha, CATEGORIA_ICONS, ICONO_DEFECTO } from '../utils/formatters';
import type { Movimiento } from '../utils/storage';

interface Props {
  movimiento: Movimiento;
  onEditar: (movimiento: Movimiento) => void;
  onEliminar: (id: string) => void;
}

const TarjetaMovimiento = ({ movimiento, onEditar, onEliminar }: Props) => {
  const { id, tipo, monto, fecha, categoria, descripcion } = movimiento;
  const icono = CATEGORIA_ICONS[categoria] || ICONO_DEFECTO;

  return (
    <article className="movimiento-item">
      <div className="movimiento-info">
        <div className={`movimiento-icon ${tipo}`}>
          <i className={`fa-solid ${icono}`}></i>
        </div>
        <div className="movimiento-details">
          <h4>{descripcion}</h4>
          <p>
            <span className="category-badge">{categoria}</span>
            {' • '}
            {formatearFecha(fecha)}
          </p>
        </div>
      </div>
      <span className={`movimiento-amount ${tipo}`}>
        {tipo === 'ingreso' ? '+' : '-'}{formatearMoneda(monto)}
      </span>
      <div className="movimiento-actions">
        <button
          className="btn btn-outline btn-icon"
          onClick={() => onEditar(movimiento)}
          title="Editar"
          aria-label={`Editar ${descripcion}`}
        >
          <Edit2 size={14} />
        </button>
        <button
          className="btn btn-danger btn-icon"
          onClick={() => onEliminar(id)}
          title="Eliminar"
          aria-label={`Eliminar ${descripcion}`}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </article>
  );
};

export default TarjetaMovimiento;