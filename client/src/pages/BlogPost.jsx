import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchBlog, deleteBlog } from "../api/blogs";

export default function BlogPost() {
  const { id } = useParams();
  const nav = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try { setPost(await fetchBlog(id)); }
      finally { setLoading(false); }
    })();
  }, [id]);

  if (loading) return <p>Loading…</p>;
  if (!post) return <p>Not found.</p>;

  return (
    <article>
      <Link to="/blog">← Back</Link>
      <h1>{post.title}</h1>
      <small>{new Date(post.createdAt).toLocaleString()}</small>
      {post.image && <img src={post.image} alt="" style={{ width: "30%", marginTop: 12, borderRadius: 8 }} />}
      <p style={{ whiteSpace: "pre-wrap", marginTop: 12 }}>{post.content}</p>

      {/* dev-only actions (remove for public site or protect with auth later) */}
      <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
        <Link to={`/blog/${id}/edit`}>Edit</Link>
        <button
          onClick={async () => { await deleteBlog(id); nav("/blog"); }}
          style={{ color: "#b00020" }}
        >
          Delete
        </button>
      </div>
    </article>
  );
}
