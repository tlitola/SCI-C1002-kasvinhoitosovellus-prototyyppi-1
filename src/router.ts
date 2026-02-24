import page from "page";
import { routes } from "./routes";
import { loadScreen } from "./screenLoader";

export function initRouter(): void {
  // Set base so page.js generates URLs with the correct path prefix (e.g. on GitHub Pages)
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  if (base) page.base(base);

  for (const [path, route] of Object.entries(routes)) {
    page(`/${path}`, () => {
      document.title = route.title;
      loadScreen(route.screen);
    });
  }

  // Stable flow entry points
  page("/flow_1", () => { page.redirect("/flow1-select-household"); });
  page("/flow_2", () => { page.redirect("/flow2-household"); });

  // Default route
  page("/", () => {
    page.redirect("/flow-select");
  });

  page({ hashbang: true });

  // page.js skips the hashchange listener when the History API is present,
  // relying on popstate instead. But popstate doesn't fire on manual URL bar
  // edits — only hashchange does. Handle it ourselves.
  window.addEventListener("hashchange", () => {
    const hash = window.location.hash;
    const path = hash.startsWith("#!") ? hash.slice(2) : "/";
    page.show(path || "/");
  });
}
