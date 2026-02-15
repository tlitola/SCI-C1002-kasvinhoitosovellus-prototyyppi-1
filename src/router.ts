import page from "page";
import { routes } from "./routes";
import { loadScreen } from "./screenLoader";

export function initRouter(): void {
  for (const [path, route] of Object.entries(routes)) {
    page(`/${path}`, () => {
      document.title = route.title;
      loadScreen(route.screen);
    });
  }

  // Default route
  page("/", () => {
    page.redirect("/select-household");
  });

  page({ hashbang: true });
}
