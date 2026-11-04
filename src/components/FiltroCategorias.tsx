import { CATEGORIAS, obtenerNombreMes } from '../utils/formatters';

interface Props {
  mesFiltro: number;
  anioFiltro: number;
  categoriaFiltro: string;
  busqueda: string;
  onMesChange: (mes: number) => void;
  onAnioChange: (anio: number) => void;
  onCategoriaChange: (cat: string) => void;
  onBusquedaChange: (texto: string) => void;
  onLimpiar: () => void;
}

const FiltroCategorias = ({
  mesFiltro,
  anioFiltro,
  categoriaFiltro,
  busqueda,
  onMesChange,
  onAnioChange,
  onCategoriaChange,
  onBusquedaChange,
  onLimpiar,
}: Props) => {
  const anios = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

  return (
    <div className="filters-bar">
      <div className="form-group">
        <label htmlFor="filtro-mes">Mes</label>
        <select id="filtro-mes" value={mesFiltro} onChange={(e) => onMesChange(Number(e.target.value))}>
          <option value={-1}>Todos</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i}>{obtenerNombreMes(i)}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="filtro-anio">Año</label>
        <select id="filtro-anio" value={anioFiltro} onChange={(e) => onAnioChange(Number(e.target.value))}>
          <option value={-1}>Todos</option>
          {anios.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="filtro-categoria">Categoría</label>
        <select id="filtro-categoria" value={categoriaFiltro} onChange={(e) => onCategoriaChange(e.target.value)}>
          <option value="">Todas</option>
          {CATEGORIAS.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="filtro-busqueda">Buscar</label>
        <input
          id="filtro-busqueda"
          type="text"
          placeholder="Buscar por descripción..."
          value={busqueda}
          onChange={(e) => onBusquedaChange(e.target.value)}
        />
      </div>
      <button className="btn btn-outline" onClick={onLimpiar} style={{ alignSelf: 'flex-end' }}>
        Limpiar
      </button>
    </div>
  );
};

export default FiltroCategorias;