import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Download } from 'lucide-react';
import FormularioMovimiento from '../components/FormularioMovimiento';
import ListaMovimientos from '../components/ListaMovimientos';
import FiltroCategorias from '../components/FiltroCategorias';
import { obtenerMovimientos, guardarMovimientos, type Movimiento } from '../utils/storage';

const Movimientos = () => {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [editando, setEditando] = useState<Movimiento | null>(null);
  const [mesFiltro, setMesFiltro] = useState<number>(-1);
  const [anioFiltro, setAnioFiltro] = useState<number>(-1);
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('');
  const [busqueda, setBusqueda] = useState<string>('');

  const cargarMovimientos = useCallback(() => {
    setMovimientos(obtenerMovimientos());
  }, []);

  useEffect(() => {
    cargarMovimientos();
    window.addEventListener('storage', cargarMovimientos);
    return () => window.removeEventListener('storage', cargarMovimientos);
  }, [cargarMovimientos]);

  const handleGuardar = useCallback((data: Omit<Movimiento, 'id'>) => {
    const actuales = obtenerMovimientos();
    let nuevos: Movimiento[];
    if (editando) {
      nuevos = actuales.map((m) =>
        m.id === editando.id ? { ...m, ...data } : m
      );
    } else {
      nuevos = [...actuales, { ...data, id: uuidv4() }];
    }
    setMovimientos(nuevos);
    guardarMovimientos(nuevos);
    setEditando(null);
  }, [editando]);

  const handleEliminar = useCallback((id: string) => {
    if (!confirm('¿Estás seguro de eliminar este movimiento?')) return;
    const actuales = obtenerMovimientos();
    const nuevos = actuales.filter((m) => m.id !== id);
    setMovimientos(nuevos);
    guardarMovimientos(nuevos);
  }, []);

  const handleEditar = useCallback((movimiento: Movimiento) => {
    setEditando(movimiento);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleLimpiarFiltros = () => {
    setMesFiltro(-1);
    setAnioFiltro(-1);
    setCategoriaFiltro('');
    setBusqueda('');
  };

  // Filtrar movimientos
  const movimientosFiltrados = movimientos.filter((m) => {
    const fecha = new Date(m.fecha + 'T00:00:00');

    if (mesFiltro !== -1 && fecha.getMonth() !== mesFiltro) return false;
    if (anioFiltro !== -1 && fecha.getFullYear() !== anioFiltro) return false;
    if (categoriaFiltro && m.categoria !== categoriaFiltro) return false;
    if (busqueda && !m.descripcion.toLowerCase().includes(busqueda.toLowerCase())) return false;

    return true;
  });

  // Ordenar por fecha descendente
  const movimientosOrdenados = [...movimientosFiltrados].sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );

  // Exportar a CSV
  const exportarCSV = () => {
    if (movimientosOrdenados.length === 0) {
      alert('No hay movimientos para exportar.');
      return;
    }

    const headers = ['Fecha', 'Tipo', 'Categoría', 'Descripción', 'Monto'];
    const rows = movimientosOrdenados.map((m) => [
      m.fecha,
      m.tipo === 'ingreso' ? 'Ingreso' : 'Gasto',
      m.categoria,
      `"${m.descripcion}"`,
      m.monto,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `movimientos_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="main-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 className="section-title" style={{ marginBottom: 0 }}>Movimientos</h1>
        <button className="btn btn-outline" onClick={exportarCSV} title="Exportar a CSV">
          <Download size={16} />
          Exportar CSV
        </button>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <FormularioMovimiento
          onGuardar={handleGuardar}
          movimientoEditar={editando}
          onCancelar={() => setEditando(null)}
        />
      </div>

      <FiltroCategorias
        mesFiltro={mesFiltro}
        anioFiltro={anioFiltro}
        categoriaFiltro={categoriaFiltro}
        busqueda={busqueda}
        onMesChange={setMesFiltro}
        onAnioChange={setAnioFiltro}
        onCategoriaChange={setCategoriaFiltro}
        onBusquedaChange={setBusqueda}
        onLimpiar={handleLimpiarFiltros}
      />

      <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.75rem' }}>
        Mostrando {movimientosOrdenados.length} de {movimientos.length} movimientos
      </div>

      <ListaMovimientos
        movimientos={movimientosOrdenados}
        onEditar={handleEditar}
        onEliminar={handleEliminar}
      />
    </main>
  );
};

export default Movimientos;