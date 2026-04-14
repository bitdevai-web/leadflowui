import "flatpickr/dist/flatpickr.css";
import "swiper/swiper-bundle.css";
import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Root, createRoot } from "react-dom/client";

import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { StrictMode } from "react";
import { ThemeProvider } from "./context/ThemeContext.tsx";

// Create a global property on HTMLElement to store the root instance
declare global {
  interface HTMLElement {
    __root?: Root;
  }
}

export const queryClient = new QueryClient();
const container = document.getElementById("root");

if (!container) {
  throw new Error("Root container not found!");
}

// Ensure `createRoot()` is called only once
if (!container.__root) {
  container.__root = createRoot(container);
}

container.__root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppWrapper>
          <App />
        </AppWrapper>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
