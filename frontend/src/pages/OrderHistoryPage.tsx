import React, { useEffect, useState } from 'react';
import { Eye, PencilLine } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/OrderHistoryPage.css';

type ApiOrder = {
  id?: number | null;
  orderId?: number | null;
  totalAmount?: number | null;
  orderStatus?: string | null;
  status?: string | null;
  createdAt: string;
};

type ApiOrderPage = {
  items: ApiOrder[];
  page: number;
  size: number;
  totalPages: number;
  totalItems: number;
  processingItems: number;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';
const ORDERS_PER_PAGE = 5;

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});

function getOrderId(order: ApiOrder) {
  return order.id ?? order.orderId ?? 0;
}

function getOrderTotal(order: ApiOrder) {
  return order.totalAmount ?? order.totalAmount ?? 0;
}

function getOrderStatus(order: ApiOrder) {
  return order.orderStatus ?? order.status ?? 'PENDING';
}

function formatOrderDate(date: string) {
  return dateFormatter.format(new Date(date));
}

function getStatusInfo(status: string) {
  switch (status) {
    case 'DELIVERED':
      return { label: 'ĐÃ GIAO', className: 'badge-success' };
    case 'CANCELLED':
      return { label: 'ĐÃ HỦY', className: 'badge-cancel' };
    case 'CONFIRMED':
    case 'SHIPPING':
      return { label: 'ĐANG GIAO', className: 'badge-pending' };
    default:
      return { label: 'ĐANG XỬ LÝ', className: 'badge-pending' };
  }
}

const OrderHistoryPage: React.FC = () => {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [processingItems, setProcessingItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({
      page: String(currentPage - 1),
      size: String(ORDERS_PER_PAGE),
    });

    setLoading(true);

    fetch(`${API_BASE_URL}/api/orders?${params.toString()}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Không lấy được danh sách đơn hàng');
        }

        return response.json() as Promise<ApiOrderPage>;
      })
      .then((data) => {
        setOrders(data.items);
        setTotalPages(data.totalPages);
        setTotalItems(data.totalItems);
        setProcessingItems(data.processingItems);
        setError('');
      })
      .catch((err: Error) => {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });

    return () => controller.abort();
  }, [currentPage]);

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * ORDERS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ORDERS_PER_PAGE, totalItems);
  const visiblePages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="order-page">
      <Header />

      <main className="order-page__main">
        <section className="order-hero">
          <h1 className="order-title">Lịch sử đơn hàng</h1>
          <p className="order-sub">Xem và quản lý tất cả các đơn đặt hàng từ trước đến nay của bạn.</p>
        </section>

        <section className="order-stats">
          <div className="stat-card">
            <div className="stat-label">TỔNG ĐƠN HÀNG</div>
            <div className="stat-value">{totalItems}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">ĐANG XỬ LÝ</div>
            <div className="stat-value">{processingItems}</div>
          </div>
        </section>

        <section className="order-tableCard">
          <div className="table-header">Danh sách đơn hàng</div>
          {loading ? (
            <div className="order-state">Đang tải đơn hàng...</div>
          ) : error ? (
            <div className="order-state order-state--error">{error}</div>
          ) : orders.length === 0 ? (
            <div className="order-state">Chưa có đơn hàng trong hệ thống.</div>
          ) : (
            <table className="order-table">
              <thead>
                <tr>
                  <th>Mã đơn hàng</th>
                  <th>Ngày đặt hàng</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const orderStatus = getOrderStatus(order);
                  const status = getStatusInfo(orderStatus);
                  const orderId = getOrderId(order);

                  return (
                    <tr key={orderId}>
                      <td>{(orderId)}</td>
                      <td>{formatOrderDate(order.createdAt)}</td>
                      <td>{currencyFormatter.format(getOrderTotal(order))}</td>
                      <td><span className={`badge ${status.className}`}>{status.label}</span></td>
                      <td className="actions">
                        {orderStatus === 'DELIVERED' ? (
                          <Link to={`/review?orderId=${orderId}`} className="action-btn">
                            <PencilLine className="action-btn__icon" aria-hidden="true" />
                            <span>Đánh giá</span>
                          </Link>
                        ) : (
                          <button className="action-btn" disabled>
                            <PencilLine className="action-btn__icon" aria-hidden="true" />
                            <span>Đánh giá</span>
                          </button>
                        )}
                        <Link to={`/orders/${orderId}`} className="action-btn secondary">
                          <Eye className="action-btn__icon" aria-hidden="true" />
                          <span>Chi tiết</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          <div className="order-tableFooter">
            <div className="table-note">Hiển thị {startItem}-{endItem} của {totalItems} đơn hàng</div>
            {totalPages > 1 ? (
              <div className="pagination">
                <button
                  className="page-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
                >
                  &lt;
                </button>
                {visiblePages.map((page) => (
                  <button
                    key={page}
                    className={`page-btn ${currentPage === page ? 'is-active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
                <button
                  className="page-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
                >
                  &gt;
                </button>
              </div>
            ) : null}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default OrderHistoryPage;
