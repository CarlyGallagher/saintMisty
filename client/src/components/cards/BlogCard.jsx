import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchBlogs } from "../../api/blogs";

export default function BlogCard() {
  const [latestPost, setLatestPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const blogs = await fetchBlogs();
        if (blogs.length > 0) {
          setLatestPost(blogs[0]);
        }
      } catch (error) {
        console.error("Failed to fetch latest blog post:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="y2k-card y2k-card-transparent">
        <div className="y2k-card-header">Misty's Blog</div>
        <p style={{ fontSize: "13px" }}>Loading...</p>
      </div>
    );
  }

  if (!latestPost) {
    return (
      <div className="y2k-card y2k-card-transparent">
        <div className="y2k-card-header">Misty's Blog</div>
        <p style={{ fontSize: "13px" }}>No blog posts yet.</p>
        <Link to="/blog" style={{ fontSize: "12px", marginTop: "12px", display: "block" }}>
          View All Posts →
        </Link>
      </div>
    );
  }

  const previewText = latestPost.content.substring(0, 150) + "...";

  return (
    <div className="y2k-card y2k-card-transparent">
      <div className="y2k-card-header">Misty's Blog</div>
      <div>
        <h3 style={{ fontSize: "16px", marginBottom: "8px" }}>
          <Link to={`/blog/${latestPost._id}`}>{latestPost.title}</Link>
        </h3>
        <p style={{ fontSize: "11px", color: "#666", marginBottom: "8px" }}>
          {new Date(latestPost.createdAt).toLocaleDateString()}
        </p>
        <p style={{ fontSize: "13px", lineHeight: "1.5", marginBottom: "12px" }}>
          {previewText}
        </p>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", fontSize: "12px" }}>
          <Link to={`/blog/${latestPost._id}`} style={{ fontWeight: "bold" }}>
            Read More →
          </Link>
          <Link to="/blog" style={{ fontWeight: "bold" }}>
            View All Posts
          </Link>
          <a href="#subscribe" style={{ fontWeight: "bold" }}>
            Subscribe
          </a>
        </div>
      </div>
    </div>
  );
}
