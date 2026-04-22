const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const API_URL = rawApiUrl.replace(/\/+$/, "");
export const API_ORIGIN = API_URL.replace(/\/api$/, "");
