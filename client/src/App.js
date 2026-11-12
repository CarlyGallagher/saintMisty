import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import "./styles/accessibility.css";

import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Shows from "./pages/Shows";
import EPK from "./pages/EPK";
import EmailPreferences from "./pages/EmailPreferences";
import { AuthProvider } from "./context/AuthContext";
import { AccessibilityProvider } from "./context/AccessibilityContext";
import { SubscribeModalProvider, useSubscribeModal } from "./context/SubscribeModalContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navigation from "./components/Navigation";
import PromoModal from "./components/PromoModal";
import promo from "./config/promo";

// Same as the BLOG buttons: show the email sign-up pop-up, on the home page
function BlogRedirect() {
  const { openSubscribeModal } = useSubscribeModal();
  useEffect(() => {
    openSubscribeModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <Navigate to="/" replace />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AccessibilityProvider>
          <SubscribeModalProvider>
            <a href="#main-content" className="skip-to-main">
              Skip to main content
            </a>
            <PromoModal promo={promo} />
            <div className="App">
              <Navigation />
              <main id="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shows" element={<Shows />} />
                  <Route path="/epk-0a02faa10e" element={<EPK />} />
                  {/* The blog was removed; /blog goes to the home page with the email sign-up open */}
                  <Route path="/blog/*" element={<BlogRedirect />} />
                  <Route path="/email-preferences/:id/:token" element={<EmailPreferences />} />
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                </Routes>
              </main>
            </div>
          </SubscribeModalProvider>
        </AccessibilityProvider>
      </AuthProvider>
    </Router>
  );
}


export default App;