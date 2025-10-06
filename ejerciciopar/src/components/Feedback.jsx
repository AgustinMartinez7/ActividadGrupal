export default function Feedback({ loading, error }) {
  if (loading) return <p className="info">Cargando tareas</p>;
  if (error) return <p className="error">{error}</p>;
  return null;
}
