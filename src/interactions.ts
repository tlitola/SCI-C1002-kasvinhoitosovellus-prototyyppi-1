import page from "page";

// Navigation stack — supports multiple levels of back navigation
const backStack: string[] = [];

// Stop any active camera stream when navigating to a new screen
let activeStream: MediaStream | null = null;

function stopActiveStream() {
  activeStream?.getTracks().forEach((t) => t.stop());
  activeStream = null;
}

// Cancel any pending screen callbacks (e.g. NFC scan timeouts) when navigating away
const pendingTimeouts: ReturnType<typeof setTimeout>[] = [];

function clearPendingTimeouts() {
  while (pendingTimeouts.length) clearTimeout(pendingTimeouts.pop());
}

export function bindInteractions(container: HTMLElement): void {
  stopActiveStream();
  clearPendingTimeouts();

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

  // NFC sensor connect screen
  const nfcConnect = container.querySelector<HTMLElement>("#nfc-connect");
  if (nfcConnect) {
    bindNfcConnect(container, nfcConnect);
  }

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

function bindNfcConnect(container: HTMLElement, nfcConnect: HTMLElement): void {
  const dest = nfcConnect.dataset.sensorNav!;
  const sensorId = nfcConnect.dataset.sensorId!;
  const status = container.querySelector<HTMLElement>("#nfc-status");
  const sensorList = container.querySelector<HTMLElement>("#sensor-list");

  pendingTimeouts.push(
    setTimeout(() => {
      if (status) status.textContent = "1 sensori löydetty";

      if (sensorList) {
        const item = document.createElement("li");
        item.style.cssText = "display: flex; justify-content: space-between; align-items: center; padding: 0.875rem 1rem; background: #fff; border: 1px solid #ddd; border-radius: 8px;";
        item.innerHTML = `
          <div>
            <p style="font-weight: 600; margin: 0 0 0.2rem;">${sensorId}</p>
            <p style="font-size: 0.8rem; color: #555; margin: 0;">NFC · Vahva signaali</p>
          </div>
          <button class="btn btn--primary" style="padding: 0.4rem 1rem; font-size: 0.875rem;">Valitse</button>
        `;
        item.querySelector("button")!.addEventListener("click", () => {
          const current = window.location.hash.replace(/^#!\/?/, "");
          if (current) backStack.push(current);
          page.show(`/${dest}`);
        });
        sensorList.appendChild(item);
      }
    }, 3000),
  );
}

const CORS_PROXY = "https://corsproxy.io/?url=";
let cachedUserKey: string | null = null;

async function getPastebinUserKey(): Promise<string | null> {
  if (cachedUserKey) return cachedUserKey;

  const username = import.meta.env.VITE_PASTEBIN_USERNAME;
  const password = import.meta.env.VITE_PASTEBIN_PASSWORD;
  const apiKey = import.meta.env.VITE_PASTEBIN_API_KEY;
  if (!username || !password) return null;

  const body = new URLSearchParams({ api_dev_key: apiKey, api_user_name: username, api_user_password: password });
  const loginUrl = "https://pastebin.com/api/api_login.php";
  const resp = await fetch(`${CORS_PROXY}${encodeURIComponent(loginUrl)}`, { method: "POST", body });
  const text = await resp.text();

  if (text.startsWith("Bad API request")) {
    console.error("Pastebin login failed:", text);
    return null;
  }

  cachedUserKey = text;
  return cachedUserKey;
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

  const pasteName = `SCI-C1002-17 Plant: ${val("plant-name")}`;
  const pastebinUrl = "https://pastebin.com/api/api_post.php";

  getPastebinUserKey().then((userKey) => {
    const body = new URLSearchParams({
      api_dev_key: apiKey,
      api_option: "paste",
      api_paste_code: csv,
      api_paste_name: pasteName,
      api_paste_format: "text",
      ...(userKey ? { api_user_key: userKey } : {}),
    });

    return fetch(`${CORS_PROXY}${encodeURIComponent(pastebinUrl)}`, { method: "POST", body });
  })
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
