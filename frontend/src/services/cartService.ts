import axiosClient from "../api/axiosClient";
import axios from "axios";

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface CartItemResponse {
    cartItemId: number;
    bookId: number;
    title: string;
    imageUrl?: string | null;
    price: number;
    quantity: number;
    totalPrice: number;
}

export interface CartResponse {
    cartId: number;
    items: CartItemResponse[];
    totalAmount: number;
}

export const CART_UPDATED_EVENT = "bookland:cart-updated";

export function hasAuthToken() {
    return Boolean(
        localStorage.getItem("token") ||
        localStorage.getItem("authToken") ||
        localStorage.getItem("accessToken")
    );
}

export function isAuthError(error: unknown) {
    return axios.isAxiosError(error) && (
        error.response?.status === 401 ||
        error.response?.status === 403
    );
}

export function getCartErrorMessage(error: unknown, fallback: string) {
    if (axios.isAxiosError(error)) {
        const message = (error.response?.data as { message?: string } | undefined)?.message;
        return message || fallback;
    }

    return fallback;
}

export function notifyCartUpdated(cart?: CartResponse) {
    if (typeof window !== "undefined") {
        window.dispatchEvent(
            new CustomEvent(CART_UPDATED_EVENT, { detail: { cart } })
        );
    }
}

export async function getCart() {
    const response = await axiosClient.get<ApiResponse<CartResponse>>("/cart");
    return response.data.data;
}

export async function addToCart(bookId: number, quantity = 1) {
    const response = await axiosClient.post<ApiResponse<CartResponse>>("/cart/add", {
        bookId,
        quantity,
    });
    notifyCartUpdated(response.data.data);
    return response.data.data;
}

export async function updateCartItem(cartItemId: number, quantity: number) {
    const response = await axiosClient.put<ApiResponse<CartResponse>>("/cart/update", {
        cartItemId,
        quantity,
    });
    notifyCartUpdated(response.data.data);
    return response.data.data;
}

export async function removeCartItem(cartItemId: number) {
    await axiosClient.delete<ApiResponse<null>>(`/cart/remove/${cartItemId}`);
    notifyCartUpdated();
}

export async function clearCart() {
    await axiosClient.delete<ApiResponse<null>>("/cart/clear");
    notifyCartUpdated();
}
