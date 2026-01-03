import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBlog } from "../api/blogs";

export default function NewBlog() {
  const nav = useNavigate();
  const [form, setForm] = useState({ title: "", image: "", content: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function onSubmit(e){
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      const post = await createBlog(form);
      nav(`/blog/${post._id}`);
    } catch {
      setErr("Failed to create post.");
    } finally { setBusy(false); }
  }

  return (
    <form onSubmit={onSubmit} style={{display:"grid", gap:12}}>
      <input placeholder="Title" value={form.title}
        onChange={e=>setForm(f=>({...f, title:e.target.value}))} required />
      <input placeholder="Image URL (optional)" value={form.image}
        onChange={e=>setForm(f=>({...f, image:e.target.value}))} />
      <textarea rows={10} placeholder="Content" value={form.content}
        onChange={e=>setForm(f=>({...f, content:e.target.value}))} required />
      {err && <p style={{color:"crimson"}}>{err}</p>}
      <button disabled={busy}>{busy ? "Saving…" : "Publish"}</button>
    </form>
  );
}
