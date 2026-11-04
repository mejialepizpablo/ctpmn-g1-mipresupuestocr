import { useState, useEffect } from 'react';
import { AlertTriangle, Target, TrendingUp, PieChart as PieChartIcon } from 'lucide-react';
import ResumenSaldo from '../components/ResumenSaldo';
import ConfiguracionLimites from '../components/ConfiguracionLimites';
import {
  obtenerMovimientos,
  obtenerMetas,
  EVENTO_DATOS_ACTUALIZADOS,
  type Movimiento,
  type Meta
} from '../utils/storage';
import { formatearMoneda, CATEGORIAS, CATEGORIA_ICONS, ICONO_DEFECTO } from '../utils/formatters';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORES = ['#2563eb', '#16a34a', '#f59e0b', '#dc2626', '#8b5cf6'];

const Dashboard = () => {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [metas, setMetas] = useState<Meta[]>([]);

  const cargarDatos = () => {
    setMovimientos(obtenerMovimientos());
    setMetas(obtenerMetas());
  };

  useEffect(() => {
  cargarDatos();

  const handleStorage = () => cargarDatos();

  window.addEventListener('storage', handleStorage);
  window.addEventListener(EVENTO_DATOS_ACTUALIZADOS, handleStorage);

  return () => {
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener(EVENTO_DATOS_ACTUALIZADOS, handleStorage);
  };
}, []);

  const mesActual = new Date().getMonth();
  const anioActual = new Date().getFullYear();

  // Gastos por categoría del mes actual
  const gastosPorCategoria = CATEGORIAS.map((cat) => {
    const total = movimientos
      .filter((m) => {
        const fecha = new Date(m.fecha + 'T00:00:00');
        return m.tipo === 'gasto' && m.categoria === cat && fecha.getMonth() === mesActual && fecha.getFullYear() === anioActual;
      })
      .reduce((acc, m) => acc + m.monto, 0);
    return { name: cat, value: total, icono: CATEGORIA_ICONS[cat] };
  }).filter((item) => item.value > 0);

  const totalGastosMes = movimientos
    .filter((m) => {
      const fecha = new Date(m.fecha + 'T00:00:00');
      return m.tipo === 'gasto' && fecha.getMonth() === mesActual && fecha.getFullYear() === anioActual;
    })
    .reduce((acc, m) => acc + m.monto, 0);

  const totalIngresosMes = movimientos
    .filter((m) => {
      const fecha = new Date(m.fecha + 'T00:00:00');
      return m.tipo === 'ingreso' && fecha.getMonth() === mesActual && fecha.getFullYear() === anioActual;
    })
    .reduce((acc, m) => acc + m.monto, 0);

  const presupuestoAgotado = totalIngresosMes > 0 && totalGastosMes > totalIngresosMes;

  // Resumen de metas
  const metasResumen = metas.map((meta) => {
    const ahorrado = meta.aportes.reduce((acc, a) => acc + a.monto, 0);
    const porcentaje = meta.montoObjetivo > 0 ? (ahorrado / meta.montoObjetivo) * 100 : 0;
    return { ...meta, ahorrado, porcentaje };
  });

  return (
    <main className="main-content">
      <h1 className="section-title">Dashboard</h1>

      <ResumenSaldo movimientos={movimientos} />

      {presupuestoAgotado && (
        <div className="alert alert-danger">
          <AlertTriangle size={18} />
          ¡Atención! Tus gastos del mes superan tus ingresos. Revisa tu presupuesto.
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Gráfico de gastos */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PieChartIcon size={18} />
              Gastos por categoría
            </h3>
          </div>
          {gastosPorCategoria.length === 0 ? (
            <div className="empty-state" style={{ padding: '2rem 1rem' }}>
              <p style={{ fontSize: '0.9rem' }}>No hay gastos registrados este mes.</p>
            </div>
          ) : (
            <div className="chart-container" style={{ height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={gastosPorCategoria}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {gastosPorCategoria.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORES[index % COLORES.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatearMoneda(value)}
                    contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-border)' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Metas de ahorro */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={18} />
              Metas de ahorro
            </h3>
          </div>
          {metasResumen.length === 0 ? (
            <div className="empty-state" style={{ padding: '1.5rem' }}>
              <p style={{ fontSize: '0.9rem' }}>No tienes metas de ahorro. ¡Crea una para empezar!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {metasResumen.slice(0, 4).map((meta) => (
                <div key={meta.id} style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{meta.nombre}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                      {meta.porcentaje.toFixed(0)}%
                    </span>
                  </div>
                  <div className="progress-bar-container" style={{ height: '8px' }}>
                    <div
                      className={`progress-bar-fill ${meta.porcentaje >= 100 ? 'complete' : ''}`}
                      style={{ width: `${Math.min(meta.porcentaje, 100)}%` }}
                    />
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                    {formatearMoneda(meta.ahorrado)} de {formatearMoneda(meta.montoObjetivo)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Últimos movimientos */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={18} />
            Últimos movimientos
          </h3>
        </div>
        {movimientos.length === 0 ? (
          <div className="empty-state" style={{ padding: '1.5rem' }}>
            <p style={{ fontSize: '0.9rem' }}>No hay movimientos registrados.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {movimientos
              .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
              .slice(0, 5)
              .map((mov) => (
                <div key={mov.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <i className={`fa-solid ${CATEGORIA_ICONS[mov.categoria] || ICONO_DEFECTO}`} style={{ fontSize: '1.2rem' }}></i>
                    <div>
                      <p style={{ fontSize: '0.85rem', fontWeight: 500 }}>{mov.descripcion}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{mov.categoria}</p>
                    </div>
                  </div>
                  <span style={{
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    color: mov.tipo === 'ingreso' ? 'var(--color-success)' : 'var(--color-danger)'
                  }}>
                    {mov.tipo === 'ingreso' ? '+' : '-'}{formatearMoneda(mov.monto)}
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>

      <ConfiguracionLimites />
    </main>
  );
};

export default Dashboard;