import { Link, useLocation } from "react-router-dom";
import { CheckCircle, ShoppingBag, ShoppingCart } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import type { OrderResponse } from "../services/orderService";
import "../styles/order-success.css";

type LocationState = {
  order?: OrderResponse;
};

export default function OrderSuccessPage() {
  const location = useLocation();
  const order = (location.state as LocationState | null)?.order;

  return (
    <div className="order-success-page">
      <Header />

      <main className="order-success-page__main">
        <section className="order-success__card">
          {/* Icon */}
          <div className="order-success__icon">
            <CheckCircle size={34} strokeWidth={2} />
          </div>

          <h1>Đặt hàng thành công</h1>

          <p>
            Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được ghi nhận
            và đang chờ xử lý.
          </p>

          {order ? (
            <div className="order-success__summary">
              <div className="order-success__summary-row">
                <span>Mã đơn hàng</span>
                <strong className="order-id">#{order.orderId}</strong>
              </div>

              <div className="order-success__summary-row">
                <span>Tổng tiền</span>
                <strong className="amount">
                  {Number(order.totalAmount).toLocaleString("vi-VN")}đ
                </strong>
              </div>

              <div className="order-success__summary-row">
                <span>Trạng thái</span>
                <span className="order-success__badge">Đang xử lý</span>
              </div>
            </div>
          ) : (
            <p className="order-success__empty">
              Không tìm thấy thông tin đơn hàng.
            </p>
          )}

          <div className="order-success__actions">
            <Link to="/" className="order-success__btn-primary">
              <ShoppingBag size={17} />
              Tiếp tục mua hàng
            </Link>
            <Link to="/orders" className="order-success__btn-secondary">
              <ShoppingCart size={17} />
              Xem lịch sử đơn hàng
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
