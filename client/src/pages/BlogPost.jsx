import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchBlog } from "../api/blogs";
import useNoIndex from "../utils/useNoIndex";
import "../styles/Blog.css";

export default function BlogPost() {
  const { id } = useParams();
  useNoIndex();
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
      </article>
    </div>
  );
}
