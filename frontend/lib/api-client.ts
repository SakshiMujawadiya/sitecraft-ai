// Universal API client with automatic token refresh and stale token recovery

const rawApiBase = process.env.NEXT_PUBLIC_API_URL || "";
const API_BASE = rawApiBase.replace(/\/api\/?$/, "").replace(/\/+$/, "");

interface FetchOptions extends RequestInit {
  data?: any;
  _retry?: boolean;
}

export async function apiRequest<T = any>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  // Attach token from localStorage if present
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("lp_access_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: "include", // essential for HTTP-only cookies
  };

  if (options.data) {
    config.body = JSON.stringify(options.data);
  }

  let res = await fetch(url, config);

  // If 401 Unauthorized and not already refreshing
  if (res.status === 401 && !options._retry && endpoint !== "/api/auth/refresh" && endpoint !== "/api/auth/login") {
    try {
      // Attempt token refresh via HTTP-only cookie
      const refreshRes = await fetch(`${API_BASE}/api/auth/refresh`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (refreshRes.ok) {
        const refreshData = await refreshRes.json();
        if (refreshData.accessToken && typeof window !== "undefined") {
          localStorage.setItem("lp_access_token", refreshData.accessToken);
          headers["Authorization"] = `Bearer ${refreshData.accessToken}`;
          // Retry original request once
          return apiRequest<T>(endpoint, { ...options, _retry: true });
        }
      } else {
        // Refresh failed, purge stale token
        if (typeof window !== "undefined") {
          localStorage.removeItem("lp_access_token");
        }
      }
    } catch {
      if (typeof window !== "undefined") {
        localStorage.removeItem("lp_access_token");
      }
    }
  }

  const json = await res.json().catch(() => ({ success: false, message: "Invalid JSON response" }));

  if (!res.ok) {
    throw new Error(json.message || `Request failed with status ${res.status}`);
  }

  return json as T;
}
