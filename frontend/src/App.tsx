import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductAllPage from './pages/ProductAllPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import ReviewPage from './pages/ReviewPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProductAllPage />} />
        <Route path="/orders" element={<OrderHistoryPage />} />
        <Route path="/review" element={<ReviewPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
