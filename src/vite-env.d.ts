/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PASTEBIN_API_KEY: string;
  readonly VITE_PASTEBIN_USERNAME: string;
  readonly VITE_PASTEBIN_PASSWORD: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
