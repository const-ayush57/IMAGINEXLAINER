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
    
    // CRITICAL SECURITY REQUIREMENT:
    // Ensures HTTP-only JWT cookies are sent automatically back avoiding AXIOS global interceptions
    credentials: "include", 
    
    body: data ? JSON.stringify(data) : undefined,
    ...customConfig,
  };

  const response = await fetch(`${API_URL}${endpoint}`, reqConfig);

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || `Request rejected natively with HTTP status ${response.status}`);
  }

  // Handle No-Content responses ensuring JSON parsing doesn't crash identically to node fetch specifications
  if (response.status === 204) return {} as T;
  
  return await response.json() as T;
};
