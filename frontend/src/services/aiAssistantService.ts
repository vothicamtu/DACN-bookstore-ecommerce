import axiosClient from "../api/axiosClient";

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface AiProductSuggestion {
    id: number;
    title: string;
    imageUrl?: string | null;
    description?: string | null;
    price: number;
    discountPrice?: number | null;
    discountPercent?: number | null;
    stock?: number | null;
    soldCount?: number | null;
    averageRating?: number | null;
    publishDate?: string | null;
    authorName?: string | null;
    publisherName?: string | null;
    categoryName?: string | null;
    detailUrl: string;
    badges: string[];
    score: number;
}

export interface AiChatMessage {
    role: "user" | "assistant";
    content: string;
    timestamp: string;
}

export interface AiChatResponse {
    sessionId: string;
    messageId: string;
    intent: string;
    answer: string;
    needsClarification: boolean;
    suggestions: string[];
    products: AiProductSuggestion[];
    history: AiChatMessage[];
    createdAt: string;
}

export interface AiChatRequest {
    sessionId?: string;
    message: string;
    pageUrl?: string;
    currentBookId?: number;
}

export async function sendAiMessage(request: AiChatRequest) {
    const response = await axiosClient.post<ApiResponse<AiChatResponse>>(
        "/ai-assistant/chat",
        request
    );

    return response.data.data;
}
