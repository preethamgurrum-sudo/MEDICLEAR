const isNode = typeof window === "undefined";

const getEnvValue = (key, fallback = null) => {
  if (isNode) return fallback;
  return import.meta.env[key] || fallback;
};

export const appParams = {
  appId: getEnvValue("VITE_APP_ID"),
  token: getEnvValue("VITE_ACCESS_TOKEN"),
  functionsVersion: getEnvValue("VITE_FUNCTIONS_VERSION"),
  appBaseUrl: getEnvValue("VITE_API_BASE_URL"),
};