/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SOMNIA_RPC_URL: string;
  readonly VITE_SOMNIA_CHAIN_ID: string;
  readonly VITE_SOMNIA_SCHEMA_ID: string;
  readonly VITE_CHAT_SCHEMA: string;
  readonly VITE_PRIVATE_KEY?: string;
  readonly VITE_RAINBOWKIT_PROJECT_ID: string;
  readonly VITE_API_BASE_URL: string;
  readonly GEMINI_API_KEY: string;
  readonly SOMNIA_API_BASE_URL: string;
  readonly SERVER_PORT: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
