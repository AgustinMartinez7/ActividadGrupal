import { useEffect, useState } from "react";
import "./App.css";
import NewPostForm from "./components/NewPostForm";
import CommentForm from "./components/CommentForm";

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carga los posts al iniciar
  useEffect(() => {
    fetchPosts();
  }, []);

  // Cargar todos los posts con comentarios
  async function fetchPosts() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:4000/api/posts");
      if (!res.ok) throw new Error("Error al cargar posts");
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los posts");
    } finally {
      setLoading(false);
    }
  }

  // Crear un nuevo post
  async function handleCreatePost(newPost) {
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      });
      if (!res.ok) throw new Error("Error al crear post");
      const created = await res.json();

      // Agrega el nuevo post al estado 
      setPosts((prev) => [created, ...prev]);
    } catch (err) {
      console.error(err);
      alert("Error al publicar el post");
    }
  }

  // Agregar comentario
  async function handleAddComment(postId, newComment) {
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newComment),
      });
      if (!res.ok) throw new Error("Error al crear comentario");
      const created = await res.json();

      // Actualiza los comentarios del post correspondiente
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, comments: [...p.comments, created] }
            : p
        )
      );
    } catch (err) {
      console.error(err);
      alert("Error al enviar el comentario");
    }
  }

  return (
    <div className="container">
      <h1> Blog Personal</h1>

      {/* Formulario para crear un nuevo post */}
      <NewPostForm onCreate={handleCreatePost} />

      <hr />

      <h2>Publicaciones</h2>
      {loading && <p>Cargando posts...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && posts.length === 0 && <p>No hay publicaciones aún.</p>}

      {/* Listado de posts */}
      {!loading &&
        posts.map((post) => (
          <article key={post.id} className="card post">
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <small>
              Por <strong>{post.author}</strong> —{" "}
              {new Date(post.createdAt).toLocaleString()}
            </small>

            <section className="comments">
              <h4>Comentarios ({post.comments.length})</h4>
              {post.comments.length === 0 && (
                <p className="muted">No hay comentarios aún.</p>
              )}
              {post.comments.map((c) => (
                <div key={c.id} className="comment">
                  <strong>{c.author}</strong>: {c.content}{" "}
                  <span className="date">
                    ({new Date(c.createdAt).toLocaleString()})
                  </span>
                </div>
              ))}

              {/* Formulario para agregar comentarios */}
              <CommentForm
                postId={post.id}
                onAddComment={handleAddComment}
              />
            </section>
          </article>
        ))}
    </div>
  );
}

export default App;
