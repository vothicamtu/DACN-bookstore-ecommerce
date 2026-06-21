import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductAllPage from './pages/ProductAllPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import ReviewPage from './pages/ReviewPage';
import Login from "./pages/Login";
import Register from "./pages/Register";
import SearchPage from "./pages/SearchPage";
import Home from './pages/Home';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/.." element={<ProductAllPage />} />
          <Route path="/orders" element={<OrderHistoryPage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<SearchPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
