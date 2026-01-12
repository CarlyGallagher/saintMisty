import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchBlog, deleteBlog } from "../api/blogs";
import { useAuth } from "../context/AuthContext";
import "../styles/Blog.css";

export default function BlogPost() {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try { setPost(await fetchBlog(id)); }
      finally { setLoading(false); }
    })();
  }, [id]);

  if (loading) return <div className="blog-post-container"><p className="blog-loading">Loading…</p></div>;
  if (!post) return <div className="blog-post-container"><p className="blog-empty">Not found.</p></div>;

  return (
    <div className="blog-post-container">
      <article className="blog-post-content">
        <Link to="/blog" className="blog-back-link">← Back to Blog</Link>
        <h1 className="blog-post-title">{post.title}</h1>
        <small className="blog-post-date">{new Date(post.createdAt).toLocaleString()}</small>
        {post.image && <img src={post.image} alt="" className="blog-post-image" />}
        <p className="blog-post-text">{post.content}</p>

        {/* Admin-only actions */}
        {user && (
          <div className="blog-admin-actions">
            <Link to={`/blog/${id}/edit`} className="blog-edit-link">Edit Post</Link>
            <button
              onClick={async () => { await deleteBlog(id); nav("/blog"); }}
              className="blog-delete-button"
            >
              Delete Post
            </button>
          </div>
        )}
      </article>
    </div>
  );
}
