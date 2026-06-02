const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export function resolveImageUrl(imageUrl?: string | null) {
    if (!imageUrl) {
        return undefined;
    }

    if (/^(https?:)?\/\//.test(imageUrl) || imageUrl.startsWith("data:")) {
        return imageUrl;
    }

    const normalizedPath = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
    return `${API_BASE_URL}${normalizedPath}`;
}
