interface EnvConfig {
  somnia: {
    rpcUrl: string;
    chainId: number;
    schemaId: string;
    chatSchema: string;
  };
  rainbowKit: {
    projectId: string;
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

export function loadConfig(): EnvConfig {
  const config: EnvConfig = {
    somnia: {
      rpcUrl: getRequiredEnvVar('VITE_SOMNIA_RPC_URL', import.meta.env.VITE_SOMNIA_RPC_URL),
      chainId: parseInt(getRequiredEnvVar('VITE_SOMNIA_CHAIN_ID', import.meta.env.VITE_SOMNIA_CHAIN_ID), 10),
      schemaId: getRequiredEnvVar('VITE_SOMNIA_SCHEMA_ID', import.meta.env.VITE_SOMNIA_SCHEMA_ID),
      chatSchema: getRequiredEnvVar('VITE_CHAT_SCHEMA', import.meta.env.VITE_CHAT_SCHEMA),
    },
    rainbowKit: {
      projectId: getRequiredEnvVar('VITE_RAINBOWKIT_PROJECT_ID', import.meta.env.VITE_RAINBOWKIT_PROJECT_ID),
    },
  };

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
