
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { formatearMoneda } from '../utils/formatters';
import type { Movimiento } from '../utils/storage';

interface Props {
  movimientos: Movimiento[];
}

const ResumenSaldo = ({ movimientos }: Props) => {
  const mesActual = new Date().getMonth();
  const anioActual = new Date().getFullYear();

  // Saldo disponible: todos los movimientos registrados
  const totalIngresosGeneral = movimientos
    .filter((m) => m.tipo === 'ingreso')
    .reduce((acc, m) => acc + m.monto, 0);

  const totalGastosGeneral = movimientos
    .filter((m) => m.tipo === 'gasto')
    .reduce((acc, m) => acc + m.monto, 0);

  const saldo = totalIngresosGeneral - totalGastosGeneral;

  // Ingresos y gastos del mes actual
  const movimientosMes = movimientos.filter((m) => {
    const fecha = new Date(m.fecha + 'T00:00:00');

    return (
      fecha.getMonth() === mesActual &&
      fecha.getFullYear() === anioActual
    );
  });

  const totalIngresos = movimientosMes
    .filter((m) => m.tipo === 'ingreso')
    .reduce((acc, m) => acc + m.monto, 0);

  const totalGastos = movimientosMes
    .filter((m) => m.tipo === 'gasto')
    .reduce((acc, m) => acc + m.monto, 0);

  return (
    <section className="summary-grid" aria-label="Resumen financiero">
      <div className="summary-card saldo">
        <div className="icon-wrapper">
          <Wallet size={20} />
        </div>
        <span className="label">Saldo disponible</span>
        <span className="value">{formatearMoneda(saldo)}</span>
      </div>

      <div className="summary-card ingresos">
        <div className="icon-wrapper">
          <TrendingUp size={20} />
        </div>
        <span className="label">Ingresos del mes</span>
        <span className="value">{formatearMoneda(totalIngresos)}</span>
      </div>

      <div className="summary-card gastos">
        <div className="icon-wrapper">
          <TrendingDown size={20} />
        </div>
        <span className="label">Gastos del mes</span>
        <span className="value">{formatearMoneda(totalGastos)}</span>
      </div>
    </section>
  );
};

export default ResumenSaldo;
