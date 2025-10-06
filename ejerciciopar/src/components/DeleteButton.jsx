export default function DeleteButton({ onDelete }) {
  return (
    <button
      className="delete-btn"
      onClick={(e) => {
        e.stopPropagation();
        onDelete();
      }}
    >
      
      Eliminar
    </button>
  );
}
