import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { CATEGORIAS } from '../utils/formatters';
import { validarMovimiento, ErroresMovimiento } from '../utils/validaciones';
import type { Movimiento } from '../utils/storage';

interface Props {
  onGuardar: (movimiento: Omit<Movimiento, 'id'>) => void;
  movimientoEditar?: Movimiento | null;
  onCancelar?: () => void;
}

const FormularioMovimiento = ({ onGuardar, movimientoEditar, onCancelar }: Props) => {
  const [tipo, setTipo] = useState<string>('');
  const [monto, setMonto] = useState<string>('');
  const [fecha, setFecha] = useState<string>('');
  const [categoria, setCategoria] = useState<string>('');
  const [descripcion, setDescripcion] = useState<string>('');
  const [errores, setErrores] = useState<ErroresMovimiento>({});
  const [mostrar, setMostrar] = useState(false);

  useEffect(() => {
    if (movimientoEditar) {
      setTipo(movimientoEditar.tipo);
      setMonto(String(movimientoEditar.monto));
      setFecha(movimientoEditar.fecha);
      setCategoria(movimientoEditar.categoria);
      setDescripcion(movimientoEditar.descripcion);
      setMostrar(true);
    }
  }, [movimientoEditar]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { tipo, monto, fecha, categoria, descripcion };
    const erroresValidacion = validarMovimiento(data);

    if (Object.keys(erroresValidacion).length > 0) {
      setErrores(erroresValidacion);
      return;
    }

    onGuardar({
      tipo: tipo as 'ingreso' | 'gasto',
      monto: Number(monto),
      fecha,
      categoria,
      descripcion: descripcion.trim(),
    });

    // Reset
    setTipo('');
    setMonto('');
    setFecha('');
    setCategoria('');
    setDescripcion('');
    setErrores({});
    if (!movimientoEditar) setMostrar(false);
  };

  const handleCancelar = () => {
    setTipo('');
    setMonto('');
    setFecha('');
    setCategoria('');
    setDescripcion('');
    setErrores({});
    setMostrar(false);
    onCancelar?.();
  };

  if (!mostrar && !movimientoEditar) {
    return (
      <button className="btn btn-primary" onClick={() => setMostrar(true)}>
        <Plus size={18} />
        Nuevo movimiento
      </button>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          {movimientoEditar ? 'Editar movimiento' : 'Nuevo movimiento'}
        </h3>
        <button className="btn btn-outline btn-sm" onClick={handleCancelar}>
          <X size={16} />
          Cerrar
        </button>
      </div>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="tipo">Tipo *</label>
            <select
              id="tipo"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            >
              <option value="">Seleccionar...</option>
              <option value="ingreso">Ingreso</option>
              <option value="gasto">Gasto</option>
            </select>
            {errores.tipo && <p className="form-error">{errores.tipo}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="monto">Monto (₡) *</label>
            <input
              id="monto"
              type="number"
              placeholder="Ej: 50000"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
            />
            {errores.monto && <p className="form-error">{errores.monto}</p>}
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="fecha">Fecha *</label>
            <input
              id="fecha"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
            {errores.fecha && <p className="form-error">{errores.fecha}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="categoria">Categoría *</label>
            <select
              id="categoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="">Seleccionar...</option>
              {CATEGORIAS.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errores.categoria && <p className="form-error">{errores.categoria}</p>}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="descripcion">Descripción *</label>
          <textarea
            id="descripcion"
            placeholder="Describe el movimiento..."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            maxLength={100}
          />
          {errores.descripcion && <p className="form-error">{errores.descripcion}</p>}
        </div>
        <button type="submit" className="btn btn-success">
          {movimientoEditar ? 'Guardar cambios' : 'Registrar movimiento'}
        </button>
      </form>
    </div>
  );
};

export default FormularioMovimiento;