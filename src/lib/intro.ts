// Lets the home hero start its entrance as the intro overlay reveals the page
export const INTRO_DONE_EVENT = "intro:done";

declare global {
  interface Window {
    __introDone?: boolean;
  }
}

export function signalIntroDone() {
  window.__introDone = true;
  window.dispatchEvent(new Event(INTRO_DONE_EVENT));
}

export function isIntroDone() {
  return typeof window !== "undefined" && !!window.__introDone;
}

// Set after the first client-side navigation. The home intro only plays when
// the site is opened (or refreshed) on the home page, not when navigating to it.
let navigated = false;

export function markNavigated() {
  navigated = true;
}

export function hasNavigated() {
  return navigated;
}

// Ask the page transition to animate to `href` (falls back to a normal navigation)
export const NAVIGATE_EVENT = "page-transition:navigate";

export function transitionTo(href: string) {
  window.dispatchEvent(new CustomEvent<string>(NAVIGATE_EVENT, { detail: href }));
}
