import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";


import Home from "./pages/Home";
import BlogList from "./pages/BlogList";
import BlogPost from "./pages/BlogPost";
import NewBlog from "./pages/NewBlog";
import EditBlog from "./pages/EditBlog";
import AdminLogin from "./pages/AdminLogin";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
HEADER HERE EVENTUALLY
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/new" element={<ProtectedRoute><NewBlog /></ProtectedRoute>} />
            <Route path="/blog/:id/edit" element={<ProtectedRoute><EditBlog /></ProtectedRoute>} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/admin/login" element={<AdminLogin />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}


export default App;