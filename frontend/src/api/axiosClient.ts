import axios from "axios";

const axiosClient = axios.create({
    baseURL: "http://localhost:8080/api", // Bỏ cái import.meta.env đi để tránh bị file cấu hình ẩn đè sai cổng
    headers: {
        "Content-Type": "application/json",
    },
});

axiosClient.interceptors.request.use((config) => {
    const token =
        localStorage.getItem("token") ||
        localStorage.getItem("authToken") ||
        localStorage.getItem("accessToken");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default axiosClient;
