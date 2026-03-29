export async function apiFetch(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem("logistics_token") || "";

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...options.headers,
    } as any;

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(endpoint, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        // Only clear if we actually had a token (to avoid clearing during initial login check)
        if (token) {
            localStorage.removeItem("logistics_token");
            localStorage.removeItem("logistics_refresh_token");
            localStorage.removeItem("logistics_user");
            window.dispatchEvent(new Event('session-expired'));
        }
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response;
}
