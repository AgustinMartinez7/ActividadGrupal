/* Crear un sistema de blog donde los usuarios puedan publicar artículos y agregar
comentarios a las publicaciones. Implementa una interfaz que permita la interacción
completa con posts y comentarios. 

Backend (Express.js)
● Endpoint GET /api/posts - Listar todos los posts con sus comentarios
● Endpoint POST /api/posts - Crear nuevo post
● Endpoint POST /api/posts/:id/comments - Agregar comentario a un post
*/

const express = require("express")
const createError = require("http-errors")
const fs = require("fs/promises");
const path = require("path");
const postsRouter = express.Router()

//Ruta absoluta al archivo JSON
const filePath = path.join(__dirname, "../data_posts.json")

// Función auxiliar para leer el archivo JSON
const leerPosts = async () => {
  const data = await fs.readFile(filePath, "utf-8")
  return JSON.parse(data) 
}

// Función auxiliar para guardar el array actualizado de las posts en el archivo.json
const guardarPosts = async (posts) => {
  await fs.writeFile(filePath, JSON.stringify(posts, null, 2)) 
}
// GET /api/posts/
postsRouter.get('/', async (req, res, next) => {
  leerPosts()
    .then(posts => res.json(posts))
    .catch(err => next(createError(500, "Error al leer los posts")))
})

// GET /api/posts/:id
postsRouter.get('/:id', async (req, res, next) => {
  const id = parseInt(req.params.id);
  leerPosts()
    .then(posts => {
      const post = posts.find(m => m.id === id)
      if (!post) return next(createError(404, "El post solicitado no existe"))
      res.json(post);
    })
    .catch(err => next(createError(500, "Error al buscar el post")))
})

// POST /api/posts/
postsRouter.post('/', async (req, res, next) => {
  const { title, content, author } = req.body; // <-- Agrega author aquí
  if (!title || !content || !author) {
    return next(createError(400, "Faltan datos: título, contenido y autor son obligatorios"));
  }
  leerPosts()
    .then(posts => {
      const nuevoPost = {
        id: posts.length ? posts[posts.length - 1].id + 1 : 1,
        title,
        content,
        author,
        createdAt: new Date().toISOString(),
        comments: [],
      };
      posts.push(nuevoPost)
      return guardarPosts(posts).then(() => res.status(201).json(nuevoPost))
    })
    .catch(err => next(createError(500, "Error al guardar el nuevo post")))
})

// POST /api/posts/:id/comments - Agregar comentario a un post
postsRouter.post('/:id/comments', async (req, res, next) => {
  const id = parseInt(req.params.id);
  const { author, content } = req.body;

  if (!author || !content) {
    return next(createError(400, "Faltan datos: autor y contenido son obligatorios"));
  }

  try {
    const posts = await leerPosts();
    const post = posts.find(p => p.id === id);

    if (!post) {
      return next(createError(404, "El post solicitado no existe"));
    }

    const nuevoComentario = {
      id: post.comments && post.comments.length ? post.comments[post.comments.length - 1].id + 1 : 1,
      author,
      content,
      createdAt: new Date().toISOString()
    };

    if (!post.comments) post.comments = [];
    post.comments.push(nuevoComentario);

    await guardarPosts(posts);
    res.status(201).json(nuevoComentario);
  } catch (err) {
    next(createError(500, "Error al agregar el comentario"));
  }
});

module.exports = postsRouter;