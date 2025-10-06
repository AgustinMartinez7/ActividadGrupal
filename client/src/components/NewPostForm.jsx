import React, { useState } from "react";

export default function NewPostForm({ onCreate }) {
  const [form, setForm] = useState({ title: "", content: "", author: "" });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.title || !form.content || !form.author) {
      alert("Completa todos los campos");
      return;
    }

    const newPost = {
      ...form,
      createdAt: new Date().toISOString(),
    };

    await onCreate(newPost);
    setForm({ title: "", content: "", author: "" });
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h2>Crear nuevo post</h2>

      <label>
        Título
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Título del post"
        />
      </label>

      <label>
        Contenido
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="Contenido..."
          rows={4}
        />
      </label>

      <label>
        Autor
        <input
          type="text"
          name="author"
          value={form.author}
          onChange={handleChange}
          placeholder="Tu nombre"
        />
      </label>

      <button type="submit">Publicar</button>
    </form>
  );
}
