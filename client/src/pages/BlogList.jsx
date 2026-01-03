import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchBlogs } from "../api/blogs";

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

  if (loading) return <p>Loading…</p>;
  if (!posts.length) return <p>No posts yet.</p>;

  return (
    <section>
      <h1>Blog</h1>
      <ul style={{listStyle:"none", padding:0}}>
        {posts.map(p => (
          <li key={p._id} style={{padding:"12px 0", borderBottom:"1px solid #eee"}}>
            <h3><Link to={`/blog/${p._id}`}>{p.title}</Link></h3>
            <small>{new Date(p.createdAt).toLocaleDateString()}</small>
            <p>{truncate(p.content,180)}</p>
            <Link to={`/blog/${p._id}`}>Read more →</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
function truncate(s="", n=180){return s.length>n?s.slice(0,n).trimEnd()+"…":s;}
