import axiosClient from "../api/axiosClient";

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

export async function getCart() {
    const response = await axiosClient.get<ApiResponse<CartResponse>>("/cart");
    return response.data.data;
}

export async function addToCart(bookId: number, quantity = 1) {
    const response = await axiosClient.post<ApiResponse<CartResponse>>("/cart/add", {
        bookId,
        quantity,
    });
    return response.data.data;
}

export async function updateCartItem(cartItemId: number, quantity: number) {
    const response = await axiosClient.put<ApiResponse<CartResponse>>("/cart/update", {
        cartItemId,
        quantity,
    });
    return response.data.data;
}

export async function removeCartItem(cartItemId: number) {
    await axiosClient.delete<ApiResponse<null>>(`/cart/remove/${cartItemId}`);
}

export async function clearCart() {
    await axiosClient.delete<ApiResponse<null>>("/cart/clear");
}
