import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductAllPage from './pages/ProductAllPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import ReviewPage from './pages/ReviewPage';
// import Login from "./pages/Login";
// import Register from "./pages/Register";
import SearchPage from "./pages/SearchPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import OrderHistoryDetailPage from "./pages/OrderHistoryDetailPage";
import AdminBookPage from './pages/AdminBookPage';
import AdminUserPage from './pages/AdminUserPage'
import AdminCategoryPage from "./pages/AdminCategoryPage";
import AdminOrderPage from "./pages/AdminOrderPage";
const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<ProductAllPage />} />
                <Route path="/books" element={<ProductAllPage />} />
                <Route path="/orders" element={<OrderHistoryPage />} />
                <Route path="/review" element={<ReviewPage />} />
                {/*<Route path="/login" element={<Login />} />*/}
                {/*<Route path="/register" element={<Register />} />*/}
                <Route path="/search" element={<SearchPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/checkout/success" element={<OrderSuccessPage />} />
                <Route path="/orders/:id" element={<OrderHistoryDetailPage />} />

                {/* CHÈN THÊM ROUTE ADMIN VÀO ĐÂY */}
                <Route path="/admin/books" element={<AdminBookPage />} />
                <Route path="/admin/user" element={<AdminUserPage />} />
                <Route path="/admin/categories" element={<AdminCategoryPage />} />
                <Route path="/admin/orders" element={<AdminOrderPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
