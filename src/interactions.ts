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
      // Save form data if this button is inside a form with data-form-key
      const form = el.closest<HTMLFormElement>("form[data-form-key]");
      if (form) {
        const key = form.dataset.formKey!;
        const name = form.querySelector<HTMLInputElement>("#plant-name")?.value ?? "";
        sessionStorage.setItem(`plantName${key}`, name);
        submitToPastebin(form);
      }

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

  // Populate plant names from stored form data
  container.querySelectorAll<HTMLElement>("[data-plant-name-key]").forEach((el) => {
    const name = sessionStorage.getItem(`plantName${el.dataset.plantNameKey!}`);
    if (name) el.textContent = name;
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

function submitToPastebin(form: HTMLFormElement): void {
  const apiKey = import.meta.env.VITE_PASTEBIN_API_KEY;
  if (!apiKey) return;

  const val = (id: string) =>
    form.querySelector<HTMLInputElement | HTMLSelectElement>(`#${id}`)?.value ?? "";

  const headers = ["plant_name", "watering_freq_days", "watering_amount_dl", "notes", "plant_size_cm", "pot_size_l", "watering_method"];
  const values = [
    val("plant-name"),
    val("watering-freq"),
    val("watering-amount"),
    val("notes"),
    val("plant-size"),
    val("pot-size"),
    val("watering-method"),
  ];
  const csv = [
    headers.join(","),
    values.map((v) => `"${v.replace(/"/g, '""')}"`).join(","),
  ].join("\n");

  const body = new URLSearchParams({
    api_dev_key: apiKey,
    api_option: "paste",
    api_paste_code: csv,
    api_paste_name: `SCI-C1002-17 Plant: ${val("plant-name")}`,
    api_paste_format: "text",
  });

  const pastebinUrl = "https://pastebin.com/api/api_post.php";
  fetch(`https://corsproxy.io/?url=${encodeURIComponent(pastebinUrl)}`, { method: "POST", body })
    .then((r) => r.text())
    .then((url) => console.log("Pastebin paste created:", url))
    .catch((err) => console.error("Pastebin submission failed:", err));
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
