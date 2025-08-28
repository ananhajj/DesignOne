import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// أضف الاستيراد للـ ContentProvider و AdminBar
import { ContentProvider } from "./cms/ContentProvider.jsx";
import { AdminBar } from "./cms/AdminBar.jsx";
import { AuthProvider } from "./auth/AuthProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ContentProvider initialLocale="ar">
        <AdminBar />
        <App />
      </ContentProvider>
    </AuthProvider>
  </StrictMode>
);
