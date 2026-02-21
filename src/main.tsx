import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "@dr.pogodin/react-helmet";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <TooltipProvider>
        <App />
      </TooltipProvider>
    </HelmetProvider>
  </StrictMode>
);
