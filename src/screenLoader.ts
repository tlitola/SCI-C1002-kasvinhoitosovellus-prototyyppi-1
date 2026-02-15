import { bindInteractions } from "./interactions";

const screenCache = new Map<string, string>();
const baseUrl = import.meta.env.BASE_URL;
const basePath = import.meta.env.DEV ? "/src/screens" : `${baseUrl}screens`;

export async function loadScreen(screenFile: string): Promise<void> {
  const app = document.getElementById("app");
  if (!app) return;

  let html = screenCache.get(screenFile);
  if (!html) {
    const resp = await fetch(`${basePath}/${screenFile}`);
    html = await resp.text();
    screenCache.set(screenFile, html);
  }

  app.innerHTML = html;
  app.querySelectorAll<HTMLImageElement>("img[src^='/']").forEach((img) => {
    img.src = `${baseUrl}${img.getAttribute("src")!.slice(1)}`;
  });
  bindInteractions(app);
}
