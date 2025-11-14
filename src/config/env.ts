interface EnvConfig {
  somnia: {
    rpcUrl: string;
    chainId: number;
    schemaId: string;
    chatSchema: string;
    privateKey: string;
  };
  rainbowKit: {
    projectId: string;
  };
  gemini?: {
    apiKey: string;
  };
  server?: {
    apiBaseUrl: string;
    port: number;
  };
}

function getRequiredEnvVar(key: string, envValue: string | undefined): string {
  if (!envValue) {
    const isDevelopment = import.meta.env.DEV;
    const errorMessage = `Missing required environment variable: ${key}`;
    
    if (isDevelopment) {
      console.error(errorMessage);
      throw new Error(`${errorMessage}. Please check your .env file and ensure all required variables from .env.example are set.`);
    } else {
      throw new Error(errorMessage);
    }
  }
  return envValue;
}

function getOptionalEnvVar(envValue: string | undefined, defaultValue: string): string {
  return envValue || defaultValue;
}

export function loadConfig(): EnvConfig {
  const config: EnvConfig = {
    somnia: {
      rpcUrl: getRequiredEnvVar('VITE_SOMNIA_RPC_URL', import.meta.env.VITE_SOMNIA_RPC_URL),
      chainId: parseInt(getRequiredEnvVar('VITE_SOMNIA_CHAIN_ID', import.meta.env.VITE_SOMNIA_CHAIN_ID), 10),
      schemaId: getRequiredEnvVar('VITE_SOMNIA_SCHEMA_ID', import.meta.env.VITE_SOMNIA_SCHEMA_ID),
      chatSchema: getRequiredEnvVar('VITE_CHAT_SCHEMA', import.meta.env.VITE_CHAT_SCHEMA),
      privateKey: getRequiredEnvVar('VITE_PRIVATE_KEY', import.meta.env.VITE_PRIVATE_KEY),
    },
    rainbowKit: {
      projectId: getRequiredEnvVar('VITE_RAINBOWKIT_PROJECT_ID', import.meta.env.VITE_RAINBOWKIT_PROJECT_ID),
    },
  };

  // Optional configuration
  if (import.meta.env.GEMINI_API_KEY) {
    config.gemini = {
      apiKey: import.meta.env.GEMINI_API_KEY,
    };
  }

  if (import.meta.env.SOMNIA_API_BASE_URL) {
    config.server = {
      apiBaseUrl: getOptionalEnvVar(import.meta.env.SOMNIA_API_BASE_URL, 'http://localhost:3001'),
      port: parseInt(getOptionalEnvVar(import.meta.env.SERVER_PORT, '3001'), 10),
    };
  }

  return config;
}

let cachedConfig: EnvConfig | null = null;

export function getConfig(): EnvConfig {
  if (!cachedConfig) {
    cachedConfig = loadConfig();
  }
  return cachedConfig;
}

export default getConfig;
