// Clean, Type-Safe Native Fetch API Wrapper
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

interface RequestConfig extends RequestInit {
  data?: any;
}

export const apiClient = async <T = any>(endpoint: string, config: RequestConfig = {}): Promise<T> => {
  const { data, headers: customHeaders, ...customConfig } = config;

  const headers: Record<string, string> = {
    ...(customHeaders as Record<string, string>),
  };

  if (data) {
    headers["Content-Type"] = "application/json";
  }

  const reqConfig: RequestInit = {
    method: data ? "POST" : "GET",
    headers,
    credentials: "include",
    body: data ? JSON.stringify(data) : undefined,
    ...customConfig,
  };

  const response = await fetch(`${API_URL}${endpoint}`, reqConfig);

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const err: any = new Error(errorBody.error || `Request failed with HTTP status ${response.status}`);
    err.status = response.status; // Expose status for 402/403 interceptors in Home.tsx
    throw err;
  }

  if (response.status === 204) return {} as T;
  
  return await response.json() as T;
};
