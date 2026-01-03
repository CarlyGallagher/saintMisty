import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchBlogs } from "../api/blogs";

export default function Home() {
  const [latest, setLatest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const blogs = await fetchBlogs();      // newest first from backend
        setLatest(blogs[0] || null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p>Loading…</p>;
  if (!latest) return <p>No blog posts yet.</p>;

  return (
    <article>
      <h2>{latest.title}</h2>
      <small>{new Date(latest.createdAt).toLocaleDateString()}</small>
      {latest.image && <img src={latest.image} alt="" style={{width:"10%", borderRadius:8, margin:"12px 0"}} />}
      <p>{truncate(latest.content, 220)}</p>
      <Link to={`/blog/${latest._id}`}>Read more →</Link>
    </article>
  ); 
}
function truncate(s="", n=220){return s.length>n?s.slice(0,n).trimEnd()+"…":s;}
