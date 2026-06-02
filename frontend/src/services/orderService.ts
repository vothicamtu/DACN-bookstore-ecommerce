import axiosClient from "../api/axiosClient";
import type { ApiResponse } from "./cartService";

export type OrderStatus =
    | "PENDING"
    | "CONFIRMED"
    | "SHIPPING"
    | "COMPLETED"
    | "CANCELLED";

export interface OrderItemResponse {
    orderItemId: number;
    bookId: number;
    title: string;
    quantity: number;
    price: number;
    totalPrice: number;
}

export interface OrderResponse {
    orderId: number;
    username: string;
    items: OrderItemResponse[];
    totalAmount: number;
    status: OrderStatus;
    shippingAddress: string;
    phoneNumber: string;
    note?: string | null;
    createdAt: string;
}

export interface PagedResponse<T> {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}

export interface CreateOrderPayload {
    shippingAddress: string;
    phoneNumber: string;
    note?: string;
}

export async function createOrder(payload: CreateOrderPayload) {
    const response = await axiosClient.post<ApiResponse<OrderResponse>>("/orders", payload);
    return response.data.data;
}

export async function getMyOrders(page = 0, size = 10) {
    const response = await axiosClient.get<ApiResponse<PagedResponse<OrderResponse>>>(
        "/orders/my-orders",
        { params: { page, size } }
    );
    return response.data.data;
}
