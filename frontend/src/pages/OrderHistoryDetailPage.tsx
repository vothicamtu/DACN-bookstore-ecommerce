import React, { useEffect, useState } from 'react';
import { ArrowLeft, Download } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/OrderHistoryDetailPage.css';

type OrderItem = {
  orderItemId?: number;
  bookId?: number;
  title?: string;
  imageUrl?: string | null;
  quantity?: number;
  price?: number;
};

type Order = {
  orderId?: number;
  items?: OrderItem[];
  totalAmount?: number;
  createdAt?: string;
  shippingAddress?: string;
  phoneNumber?: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

const currency = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 });

function resolveImageUrl(url?: string | null) {
  if (!url) return undefined;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${API_BASE_URL}${url}`;
}

const dateOnlyFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});

const timeOnlyFormatter = new Intl.DateTimeFormat('vi-VN', {
  hour: '2-digit',
  minute: '2-digit',
});

function formatOrderDate(date?: string) {
  if (!date) return '';
  try {
    const d = new Date(date);
    return `${dateOnlyFormatter.format(d)} • ${timeOnlyFormatter.format(d)}`;
  } catch {
    return date;
  }
}

const OrderHistoryDetailPage: React.FC = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${API_BASE_URL}/api/orders/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Không lấy được đơn hàng');
        return res.json();
      })
      .then((wrapper) => setOrder(wrapper?.data ?? null))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="order-detail-page">
      <Header />

      <main className="order-detail__main">
        <div className="order-detail__top">
          <Link to="/orders" className="back-link">
            <ArrowLeft size={16} /> Quay lại đơn hàng của tôi
          </Link>

          {order && (
            <div className="order-header">
              <div>
                <h2 className="order-code">Mã đơn: <span>{order.orderId ? `${String(order.orderId)}` : ''}</span></h2>
                  <div className="order-meta">Ngày đặt hàng: {formatOrderDate(order.createdAt)}</div>
              </div>
            </div>
          )}
        </div>

        <div className="order-detail__content">
          <div className="left-col">
            <div className="card items-card">
              <h3 className="card-title">Sách đã đặt <span className="muted">({order?.items?.length ?? 0})</span></h3>

              {loading ? (
                <div className="order-state">Đang tải...</div>
              ) : error ? (
                <div className="order-state order-state--error">{error}</div>
              ) : (
                <div className="items-list">
                  {order?.items?.map((it) => (
                    <div className="item-row" key={it.orderItemId ?? it.bookId}>
                      {it.imageUrl ? (
                        <img src={resolveImageUrl(it.imageUrl)} alt={it.title} className="thumb" />
                      ) : (
                        <div className="thumb" />
                      )}
                      <div className="item-info">
                        <div className="item-title">{it.title}</div>
                        <div className="item-meta">Số lượng: {it.quantity}</div>
                      </div>
                      <div className="item-right">
                        <div className="item-price">{it.price ? currency.format(it.price) : ''}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <aside className="right-col">
            <div className="card summary-card">
              <h4 className="card-subtitle">ĐỊA CHỈ GIAO HÀNG</h4>
              <div className="address">
                {order?.shippingAddress}
                <br />
                {order?.phoneNumber}
              </div>
            </div>

            <div className="card payment-card">
              <h4 className="card-subtitle">Tóm tắt thanh toán</h4>
              <div className="summary-row"><span>Tạm tính</span><span>{order?.totalAmount ? currency.format(order.totalAmount) : ''}</span></div>
              <div className="summary-row total"><span>Tổng cộng</span><span>{order?.totalAmount ? currency.format(order.totalAmount) : ''}</span></div>
              
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderHistoryDetailPage;
