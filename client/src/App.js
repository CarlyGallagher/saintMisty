import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";


import Home from "./pages/Home";
import BlogList from "./pages/BlogList";
import BlogPost from "./pages/BlogPost";
import NewBlog from "./pages/NewBlog";
import EditBlog from "./pages/EditBlog";

function App() {
  return (
    <Router>
      <div className="App">
HEADER HERE EVENTUALLY
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/new" element={<NewBlog />} />
          <Route path="/blog/:id/edit" element={<EditBlog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;