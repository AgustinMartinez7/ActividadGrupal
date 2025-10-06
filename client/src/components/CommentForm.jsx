import React, { useState } from "react";

export default function CommentForm({ postId, onAddComment }) {
  const [comment, setComment] = useState({ author: "", content: "" });

  function handleChange(e) {
    setComment({ ...comment, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!comment.author || !comment.content) {
      alert("Completa autor y contenido");
      return;
    }

    const newComment = {
      ...comment,
      createdAt: new Date().toISOString(),
    };

    await onAddComment(postId, newComment);
    setComment({ author: "", content: "" });
  }

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <input
        type="text"
        name="author"
        placeholder="Tu nombre"
        value={comment.author}
        onChange={handleChange}
      />
      <input
        type="text"
        name="content"
        placeholder="Escribe un comentario."
        value={comment.content}
        onChange={handleChange}
      />
      <button type="submit">COMENTAR</button>
    </form>
  );
}
