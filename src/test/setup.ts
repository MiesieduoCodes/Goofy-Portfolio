import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Unmount rendered components between tests (automatic only with Vitest globals on)
afterEach(() => cleanup());

// Browser-only shims; skipped for tests that run in the Node environment (e.g. API routes)
if (typeof window !== "undefined") {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => {},
    }),
  });

  // Framer Motion's whileInView needs IntersectionObserver, which jsdom lacks
  class MockIntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  Object.defineProperty(window, "IntersectionObserver", { writable: true, value: MockIntersectionObserver });
}
