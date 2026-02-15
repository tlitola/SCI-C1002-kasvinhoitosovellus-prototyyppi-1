import page from "page";

export function bindInteractions(container: HTMLElement): void {
  // data-nav: navigate to a route
  container.querySelectorAll<HTMLElement>("[data-nav]").forEach((el) => {
    el.addEventListener("click", () => {
      const target = el.dataset.nav!;
      page.show(`/${target}`);
    });
  });

  // data-toggle: toggle hidden attribute on target element
  container.querySelectorAll<HTMLElement>("[data-toggle]").forEach((el) => {
    el.addEventListener("click", () => {
      const targetId = el.dataset.toggle!;
      const target = document.getElementById(targetId);
      if (target) {
        target.hidden = !target.hidden;
      }
    });
  });
}
