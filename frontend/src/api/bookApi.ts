import axiosClient from "./axiosClient";

export interface Book {
    id: number;
    title: string;
    imageUrl: string;
    description: string;
    price: number;
    discountPercent: number;
    stock: number;
    authorName: string;
    categoryName: string;
    publisherName: string;
    averageRating: number;
    soldCount: number;
    pageCount: number;
    size: string;
    translator: string;
    publishDate: string;
}

export interface PagedResponse<T> {
    content: T[];
    pageNo: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

const bookApi = {
    // Lấy danh sách sách có phân trang & lọc
    getAll: (params?: any) => {
        return axiosClient.get<ApiResponse<PagedResponse<Book>>>("/books", { params });
    },
    // Lấy chi tiết 1 cuốn sách
    getById: (id: number | string) => {
        return axiosClient.get<ApiResponse<Book>>(`/books/${id}`);
    },
    // Lấy sách mới
    getNewest: (limit: number = 4) => {
        return axiosClient.get<ApiResponse<PagedResponse<Book>>>("/books/new", { params: { limit } });
    },
    // Lấy sách bán chạy
    getBestSellers: (limit: number = 4) => {
        return axiosClient.get<ApiResponse<PagedResponse<Book>>>("/books/best-seller", { params: { limit } });
    }
};

export default bookApi;