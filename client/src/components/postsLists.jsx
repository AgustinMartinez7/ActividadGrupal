import { useState, useEffect } from "react";
import CommentForm from "./CommentForm";

function PostsList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
    try {
      const respuesta = await fetch('http://localhost:4000/api/posts');
      const arregloPosts = await respuesta.json();
      setPosts(arregloPosts); 
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  fetchPosts();
  }, []);

  return(
    <div>
      <h1>Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <p><strong>Autor:</strong> {post.author}</p>
            <p><strong>Fecha:</strong> {post.createAt}</p>
            <h4>Comentarios:</h4>
            <ul>
              {post.comments.map((comment) => (
                <li key={comment.id}>
                  <p><strong>{comment.author}:</strong> {comment.content}</p>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

    </div>
  );
};

export default PostsList;