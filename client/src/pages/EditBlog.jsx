import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchBlog, updateBlog } from "../api/blogs";

export default function EditBlog() {
  const { id } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState({ title: "", image: "", content: "" });
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const post = await fetchBlog(id);
        setForm({
          title: post.title,
          image: post.image || "",
          content: post.content
        });
      } catch {
        setErr("Failed to load blog post.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      await updateBlog(id, form);
      nav(`/blog/${id}`);
    } catch {
      setErr("Failed to update post.");
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <p>Loading…</p>;

  return (
    <form onSubmit={onSubmit} style={{display:"grid", gap:12}}>
      <h2>Edit Blog Post</h2>
      <input placeholder="Title" value={form.title}
        onChange={e=>setForm(f=>({...f, title:e.target.value}))} required />
      <input placeholder="Image URL (optional)" value={form.image}
        onChange={e=>setForm(f=>({...f, image:e.target.value}))} />
      <textarea rows={10} placeholder="Content" value={form.content}
        onChange={e=>setForm(f=>({...f, content:e.target.value}))} required />
      {err && <p style={{color:"crimson"}}>{err}</p>}
      <button disabled={busy}>{busy ? "Saving…" : "Update"}</button>
    </form>
  );
}
