import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ReactLenis } from "lenis/react";
import "@/index.css";
import App from "@/App";
import CaseStudyPage from "@/CaseStudyPage";
import { ReadModeProvider } from "@/components/site/ReadMode";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  },
});

// Smooth inertia scrolling, applied once at the root so it covers every
// route. `root` attaches Lenis directly to the window/document scroll
// (no wrapper divs), so native scroll listeners — framer-motion's
// useScroll, IntersectionObserver-based nav highlighting — keep working
// unmodified. Touch is left native (syncTouch: false) since smoothing
// touch scroll tends to feel worse than the OS's own momentum.
const lenisOptions = {
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  syncTouch: false,
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactLenis root options={lenisOptions}>
        <BrowserRouter>
          <ReadModeProvider>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/work/:slug" element={<CaseStudyPage />} />
            <Route path="*" element={<App />} />
          </Routes>
          </ReadModeProvider>
        </BrowserRouter>
      </ReactLenis>
    </QueryClientProvider>
  </React.StrictMode>,
);