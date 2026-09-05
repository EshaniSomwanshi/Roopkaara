import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Lenis from "lenis";
import "@/index.css";
import App from "@/App";
import CaseStudyPage from "@/CaseStudyPage";
import { ReadModeProvider } from "@/components/site/ReadMode";
import { LenisContext } from "@/lib/smoothScroll";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  },
});

/* Smooth inertia scrolling, applied once at the root so it covers every
   route. No `wrapper`/`content` options are passed, so Lenis attaches
   directly to window/document scroll (not a wrapper div) — native scroll
   listeners (framer-motion's useScroll, IntersectionObserver-based nav
   highlighting) keep working unmodified. Touch is left native
   (syncTouch defaults to false) since smoothing touch scroll tends to
   feel worse than the OS's own momentum.

   The RAF loop is explicit and manual — lenis.raf(time) must be called
   every frame for the instance to do anything; without it, Lenis is
   inert and scrolling stays completely native. */
function SmoothScrollProvider({ children }) {
  const [lenis, setLenis] = useState(null);

  useEffect(() => {
    const instance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    console.log("[Lenis] initialized:", instance);

    let rafId;
    function raf(time) {
      instance.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    setLenis(instance);

    return () => {
      cancelAnimationFrame(rafId);
      instance.destroy();
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SmoothScrollProvider>
        <BrowserRouter>
          <ReadModeProvider>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/work/:slug" element={<CaseStudyPage />} />
            <Route path="*" element={<App />} />
          </Routes>
          </ReadModeProvider>
        </BrowserRouter>
      </SmoothScrollProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
