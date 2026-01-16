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
  // Load settings from localStorage
  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem("accessibility-highContrast") === "true";
  });

  const [largeText, setLargeText] = useState(() => {
    return localStorage.getItem("accessibility-largeText") === "true";
  });

  const [reducedMotion, setReducedMotion] = useState(() => {
    return localStorage.getItem("accessibility-reducedMotion") === "true";
  });

  const [showAccessibilityMenu, setShowAccessibilityMenu] = useState(false);

  // Apply high contrast mode to document
  useEffect(() => {
    const root = document.documentElement;

    if (highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }
  }, [highContrast]);

  // Apply large text mode to document
  useEffect(() => {
    const root = document.documentElement;

    if (largeText) {
      root.classList.add("large-text");
    } else {
      root.classList.remove("large-text");
    }
  }, [largeText]);

  // Apply reduced motion mode to document
  useEffect(() => {
    const root = document.documentElement;

    if (reducedMotion) {
      root.classList.add("reduced-motion");
    } else {
      root.classList.remove("reduced-motion");
    }
  }, [reducedMotion]);

  // Save to localStorage when settings change
  useEffect(() => {
    localStorage.setItem("accessibility-highContrast", highContrast);
  }, [highContrast]);

  useEffect(() => {
    localStorage.setItem("accessibility-largeText", largeText);
  }, [largeText]);

  useEffect(() => {
    localStorage.setItem("accessibility-reducedMotion", reducedMotion);
  }, [reducedMotion]);

  const toggleHighContrast = () => setHighContrast(prev => !prev);
  const toggleLargeText = () => setLargeText(prev => !prev);
  const toggleReducedMotion = () => setReducedMotion(prev => !prev);

  const resetAll = () => {
    setHighContrast(false);
    setLargeText(false);
    setReducedMotion(false);
  };

  const value = {
    highContrast,
    largeText,
    reducedMotion,
    showAccessibilityMenu,
    toggleHighContrast,
    toggleLargeText,
    toggleReducedMotion,
    setShowAccessibilityMenu,
    resetAll
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};
