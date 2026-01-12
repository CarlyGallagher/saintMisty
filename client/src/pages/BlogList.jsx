import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchBlogs } from "../api/blogs";
import "../styles/Blog.css";

export default function BlogList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setPosts(await fetchBlogs());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="blog-container"><p className="blog-loading">Loading…</p></div>;
  if (!posts.length) return <div className="blog-container"><p className="blog-empty">No posts yet.</p></div>;

  return (
    <div className="blog-container">
      <div className="blog-header">
        <h1>Saint Misty's Blog</h1>
      </div>
      <ul className="blog-list">
        {posts.map(p => (
          <li key={p._id} className="blog-list-item">
            <h3><Link to={`/blog/${p._id}`}>{p.title}</Link></h3>
            <small className="blog-date">{new Date(p.createdAt).toLocaleDateString()}</small>
            <p className="blog-excerpt">{truncate(p.content,180)}</p>
            <Link to={`/blog/${p._id}`} className="blog-read-more">Read more →</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
function truncate(s="", n=180){return s.length>n?s.slice(0,n).trimEnd()+"…":s;}
