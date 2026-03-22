import { auth } from "../services/firebase";

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
    let token = "";

    if (auth.currentUser) {
        token = await auth.currentUser.getIdToken();
    } else {
        // Fallback to stored token if auth state is momentarily detached
        token = localStorage.getItem("lumin_token") || "";
    }

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(endpoint, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response;
}
