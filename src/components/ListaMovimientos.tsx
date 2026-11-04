import { FileText } from 'lucide-react';
import TarjetaMovimiento from './TarjetaMovimiento';
import type { Movimiento } from '../utils/storage';

interface Props {
  movimientos: Movimiento[];
  onEditar: (movimiento: Movimiento) => void;
  onEliminar: (id: string) => void;
}

const ListaMovimientos = ({ movimientos, onEditar, onEliminar }: Props) => {
  if (movimientos.length === 0) {
    return (
      <div className="empty-state">
        <FileText size={64} />
        <h3>No hay movimientos registrados</h3>
        <p>Agrega tu primer ingreso o gasto para comenzar a controlar tus finanzas.</p>
      </div>
    );
  }

  return (
    <section aria-label="Lista de movimientos">
      {movimientos.map((mov) => (
        <TarjetaMovimiento
          key={mov.id}
          movimiento={mov}
          onEditar={onEditar}
          onEliminar={onEliminar}
        />
      ))}
    </section>
  );
};

export default ListaMovimientos;