import page from "page";

// Navigation stack — supports multiple levels of back navigation
const backStack: string[] = [];

// Stop any active camera stream when navigating to a new screen
let activeStream: MediaStream | null = null;

function stopActiveStream() {
  activeStream?.getTracks().forEach((t) => t.stop());
  activeStream = null;
}

export function bindInteractions(container: HTMLElement): void {
  stopActiveStream();

  // data-nav: push current route onto stack, then navigate forward
  container.querySelectorAll<HTMLElement>("[data-nav]").forEach((el) => {
    el.addEventListener("click", () => {
      const target = el.dataset.nav!;
      const current = window.location.hash.replace(/^#!\/?/, "");
      if (current) backStack.push(current);
      page.show(`/${target}`);
    });
  });

  // data-back: pop the stack and navigate to the previous route
  container.querySelectorAll<HTMLElement>("[data-back]").forEach((el) => {
    el.addEventListener("click", () => {
      const dest = backStack.pop();
      if (dest) page.show(`/${dest}`);
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

  // Populate any plant photos from captured images
  container.querySelectorAll<HTMLImageElement>("img[data-photo-key]").forEach((img) => {
    const captured = sessionStorage.getItem(img.dataset.photoKey!);
    if (captured) img.src = captured;
  });

  // Camera screen
  const video = container.querySelector<HTMLVideoElement>("#camera-video");
  if (video) {
    bindCamera(container, video);
  }

  // Copy link button
  const copyBtn = container.querySelector<HTMLButtonElement>("#copy-link-btn");
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const url = copyBtn.dataset.url!;
      navigator.clipboard.writeText(url).then(() => {
        copyBtn.textContent = "Kopioitu ✓";
        copyBtn.classList.add("share-copy-btn--copied");
        setTimeout(() => {
          copyBtn.textContent = "Kopioi";
          copyBtn.classList.remove("share-copy-btn--copied");
        }, 2000);
      });
    });
  }
}

function bindCamera(container: HTMLElement, video: HTMLVideoElement) {
  const captureBtn = container.querySelector<HTMLButtonElement>("#capture-btn");
  const continueBtn = container.querySelector<HTMLElement>("#continue-btn");
  const canvas = container.querySelector<HTMLCanvasElement>("#capture-canvas");
  const preview = container.querySelector<HTMLImageElement>("#capture-preview");
  const errorMsg = container.querySelector<HTMLElement>("#camera-error");

  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "environment" } })
    .then((stream) => {
      activeStream = stream;
      video.srcObject = stream;
    })
    .catch(() => {
      if (errorMsg) errorMsg.style.display = "block";
      if (captureBtn) captureBtn.hidden = true;
      if (continueBtn) continueBtn.hidden = false;
    });

  captureBtn?.addEventListener("click", () => {
    if (!canvas || !video) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL("image/jpeg");
    const photoKey = captureBtn.dataset.photoKey ?? "plantImage1";
    sessionStorage.setItem(photoKey, dataUrl);

    stopActiveStream();
    video.hidden = true;
    if (preview) {
      preview.src = dataUrl;
      preview.hidden = false;
    }
    captureBtn.hidden = true;
    if (continueBtn) continueBtn.hidden = false;
  });
}
