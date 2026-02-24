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

  // Default route
  page("/", () => {
    page.redirect("/flow-select");
  });

  page({ hashbang: true });
}
