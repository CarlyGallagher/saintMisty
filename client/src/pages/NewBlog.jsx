import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBlog } from "../api/blogs";

export default function NewBlog() {
  const nav = useNavigate();
  const [form, setForm] = useState({ title: "", image: "", content: "", video: "", links: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function onSubmit(e){
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      const payload = {
        ...form,
        links: form.links ? form.links.split('\n').filter(link => link.trim()) : []
      };
      const post = await createBlog(payload);
      nav(`/blog/${post._id}`);
    } catch {
      setErr("Failed to create post.");
    } finally { setBusy(false); }
  }

  return (
    <div style={{ maxWidth: 800, margin: "24px auto", padding: 24 }}>
      <h2>Create New Blog Post</h2>
      <form onSubmit={onSubmit} style={{display:"grid", gap:12}}>
        <input className="y2k-input" placeholder="Title" value={form.title}
          onChange={e=>setForm(f=>({...f, title:e.target.value}))} required />
        <input className="y2k-input" placeholder="Image URL (optional)" value={form.image}
          onChange={e=>setForm(f=>({...f, image:e.target.value}))} />
        <input className="y2k-input" placeholder="Video URL (YouTube, Vimeo, etc. - optional)" value={form.video}
          onChange={e=>setForm(f=>({...f, video:e.target.value}))} />
        <textarea className="y2k-textarea" rows={10} placeholder="Content" value={form.content}
          onChange={e=>setForm(f=>({...f, content:e.target.value}))} required />
        <textarea className="y2k-textarea" rows={4} placeholder="Links (one per line, optional)" value={form.links}
          onChange={e=>setForm(f=>({...f, links:e.target.value}))} />
        {err && <p style={{color:"crimson"}}>{err}</p>}
        <button className="y2k-button" disabled={busy}>{busy ? "Saving…" : "Publish"}</button>
      </form>
    </div>
  );
}
