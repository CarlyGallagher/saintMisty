import { createContext, useContext, useState, useEffect } from "react";

const AccessibilityContext = createContext();

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within AccessibilityProvider");
  }
  return context;
};

export const AccessibilityProvider = ({ children }) => {
  // Load high contrast setting from localStorage
  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem("accessibility-highContrast") === "true";
  });

  // Apply high contrast mode to document
  useEffect(() => {
    const root = document.documentElement;

    if (highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }
  }, [highContrast]);

  // Save to localStorage when setting changes
  useEffect(() => {
    localStorage.setItem("accessibility-highContrast", highContrast);
  }, [highContrast]);

  const toggleHighContrast = () => setHighContrast(prev => !prev);

  const value = {
    highContrast,
    toggleHighContrast
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};
