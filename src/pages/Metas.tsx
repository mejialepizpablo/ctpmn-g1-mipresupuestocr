import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Plus, X } from 'lucide-react';
import MetaAhorro from '../components/MetaAhorro';
import { obtenerMetas, guardarMetas, type Meta, type Aporte } from '../utils/storage';
import { validarMeta, type ErroresMeta } from '../utils/validaciones';

const Metas = () => {
  const [metas, setMetas] = useState<Meta[]>([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState<Meta | null>(null);
  const [nombre, setNombre] = useState('');
  const [montoObjetivo, setMontoObjetivo] = useState('');
  const [fechaLimite, setFechaLimite] = useState('');
  const [errores, setErrores] = useState<ErroresMeta>({});

  useEffect(() => {
    setMetas(obtenerMetas());
  }, []);

  const resetForm = () => {
    setNombre('');
    setMontoObjetivo('');
    setFechaLimite('');
    setErrores({});
    setEditando(null);
    setMostrarForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { nombre, montoObjetivo, fechaLimite };
    const erroresValidacion = validarMeta(data);

    if (Object.keys(erroresValidacion).length > 0) {
      setErrores(erroresValidacion);
      return;
    }

    let nuevas: Meta[];
    if (editando) {
      nuevas = metas.map((m) =>
        m.id === editando.id
          ? { ...m, nombre: nombre.trim(), montoObjetivo: Number(montoObjetivo), fechaLimite }
          : m
      );
    } else {
      const nuevaMeta: Meta = {
        id: uuidv4(),
        nombre: nombre.trim(),
        montoObjetivo: Number(montoObjetivo),
        fechaLimite,
        aportes: [],
      };
      nuevas = [...metas, nuevaMeta];
    }

    setMetas(nuevas);
    guardarMetas(nuevas);
    resetForm();
  };

  const handleEditar = useCallback((meta: Meta) => {
    setEditando(meta);
    setNombre(meta.nombre);
    setMontoObjetivo(String(meta.montoObjetivo));
    setFechaLimite(meta.fechaLimite);
    setMostrarForm(true);
    setErrores({});
  }, []);

  const handleEliminar = useCallback((id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta meta? Se perderán todos los aportes asociados.')) return;
    const nuevas = metas.filter((m) => m.id !== id);
    setMetas(nuevas);
    guardarMetas(nuevas);
  }, [metas]);

  const handleAgregarAporte = useCallback((metaId: string, aporte: Omit<Aporte, 'id'>) => {
    const nuevas = metas.map((m) => {
      if (m.id === metaId) {
        return { ...m, aportes: [...m.aportes, { ...aporte, id: uuidv4() }] };
      }
      return m;
    });
    setMetas(nuevas);
    guardarMetas(nuevas);
  }, [metas]);

  const handleEditarAporte = useCallback((metaId: string, aporteId: string, aporte: Omit<Aporte, 'id'>) => {
    const nuevas = metas.map((m) => {
      if (m.id === metaId) {
        const aportesActualizados = m.aportes.map((a) =>
          a.id === aporteId ? { ...a, ...aporte } : a
        );
        return { ...m, aportes: aportesActualizados };
      }
      return m;
    });
    setMetas(nuevas);
    guardarMetas(nuevas);
  }, [metas]);

  const handleEliminarAporte = useCallback((metaId: string, aporteId: string) => {
    if (!confirm('¿Estás seguro de eliminar este aporte?')) return;
    const nuevas = metas.map((m) => {
      if (m.id === metaId) {
        return { ...m, aportes: m.aportes.filter((a) => a.id !== aporteId) };
      }
      return m;
    });
    setMetas(nuevas);
    guardarMetas(nuevas);
  }, [metas]);

  return (
    <main className="main-content">
      <h1 className="section-title">Metas de ahorro</h1>

      {!mostrarForm ? (
        <button className="btn btn-primary" onClick={() => setMostrarForm(true)} style={{ marginBottom: '1.5rem' }}>
          <Plus size={18} />
          Nueva meta
        </button>
      ) : (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-header">
            <h3 className="card-title">{editando ? 'Editar meta' : 'Nueva meta de ahorro'}</h3>
            <button className="btn btn-outline btn-sm" onClick={resetForm}>
              <X size={16} />
              Cerrar
            </button>
          </div>
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="meta-nombre">Nombre de la meta *</label>
              <input
                id="meta-nombre"
                type="text"
                placeholder="Ej: Viaje a la playa"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
              {errores.nombre && <p className="form-error">{errores.nombre}</p>}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="meta-monto">Monto objetivo (₡) *</label>
                <input
                  id="meta-monto"
                  type="number"
                  placeholder="Ej: 500000"
                  value={montoObjetivo}
                  onChange={(e) => setMontoObjetivo(e.target.value)}
                />
                {errores.montoObjetivo && <p className="form-error">{errores.montoObjetivo}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="meta-fecha">Fecha límite *</label>
                <input
                  id="meta-fecha"
                  type="date"
                  value={fechaLimite}
                  onChange={(e) => setFechaLimite(e.target.value)}
                />
                {errores.fechaLimite && <p className="form-error">{errores.fechaLimite}</p>}
              </div>
            </div>
            <button type="submit" className="btn btn-success">
              {editando ? 'Guardar cambios' : 'Crear meta'}
            </button>
          </form>
        </div>
      )}

      {metas.length === 0 ? (
        <div className="empty-state">
          <span style={{ fontSize: '3rem' }}><i className="fa-solid fa-bullseye" style={{ fontSize: '3rem' }}></i></span>
          <h3>No tienes metas de ahorro</h3>
          <p>Crea tu primera meta para empezar a ahorrar de forma organizada.</p>
        </div>
      ) : (
        <section aria-label="Lista de metas de ahorro">
          {metas.map((meta) => (
            <MetaAhorro
              key={meta.id}
              meta={meta}
              onEditar={handleEditar}
              onEliminar={handleEliminar}
              onAgregarAporte={handleAgregarAporte}
              onEditarAporte={handleEditarAporte}
              onEliminarAporte={handleEliminarAporte}
            />
          ))}
        </section>
      )}
    </main>
  );
};

export default Metas;