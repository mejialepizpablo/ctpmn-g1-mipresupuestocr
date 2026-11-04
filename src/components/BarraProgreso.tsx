interface Props {
  porcentaje: number;
}

const BarraProgreso = ({ porcentaje }: Props) => {
  const porcentajeLimitado = Math.min(porcentaje, 100);
  const claseExtra = porcentaje >= 100 ? 'complete' : porcentaje > 80 ? 'over' : '';

  return (
    <div className="progress-bar-container" role="progressbar" aria-valuenow={porcentajeLimitado} aria-valuemin={0} aria-valuemax={100}>
      <div
        className={`progress-bar-fill ${claseExtra}`}
        style={{ width: `${porcentajeLimitado}%` }}
      />
    </div>
  );
};

export default BarraProgreso;
