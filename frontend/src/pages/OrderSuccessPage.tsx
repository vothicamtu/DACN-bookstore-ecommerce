import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, ShoppingBag, ShoppingCart } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getOrderById, verifyVNPayPayment, type OrderResponse } from "../services/orderService"; // Thêm 2 hàm này
import "../styles/order-success.css";

type LocationState = {
  order?: OrderResponse;
};

export default function OrderSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderResponse | undefined>(
      (location.state as LocationState | null)?.order
  );
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    // Kiểm tra nếu đây là callback từ VNPay
    const queryParams = location.search;
    if (queryParams.includes("vnp_ResponseCode")) {
      const vnpCode = new URLSearchParams(queryParams).get("vnp_ResponseCode");
      const orderId = new URLSearchParams(queryParams).get("vnp_TxnRef");

      if (vnpCode === "00" && orderId) {
        setVerifying(true);
        // 1. Xác thực với Backend
        verifyVNPayPayment(queryParams)
            .then((res) => {
              if (res.success) {
                // 2. Lấy lại dữ liệu đơn hàng để hiển thị
                return getOrderById(orderId);
              }
              throw new Error("Payment failed");
            })
            .then((orderData) => {
              setOrder(orderData);
            })
            .catch((err) => {
              console.error(err);
              alert("Thanh toán không thành công!");
              navigate("/checkout");
            })
            .finally(() => setVerifying(false));
      } else {
        alert("Giao dịch bị hủy hoặc thất bại.");
        navigate("/checkout");
      }
    }
  }, [location.search, navigate]);

  if (verifying) {
    return (
        <div className="order-success-page">
          <Header />
          <main className="order-success-page__main" style={{ textAlign: 'center', padding: '50px' }}>
            <h2>Đang xác thực giao dịch...</h2>
          </main>
          <Footer />
        </div>
    );
  }

  return (
      <div className="order-success-page">
        <Header />
        <main className="order-success-page__main">
          <section className="order-success__card">
            <div className="order-success__icon">
              <CheckCircle size={34} strokeWidth={2} />
            </div>
            <h1>Đặt hàng thành công</h1>
            <p>Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được ghi nhận và đang chờ xử lý.</p>

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
                    <span className="order-success__badge">
                    {/* Nếu có logic phân biệt Online/COD thì hiện ở đây */}
                      {order.paymentMethod === "atm" ? "Đã thanh toán" : "Đang chờ xử lý"}
                </span>
                  </div>
                </div>
            ) : (
                <p className="order-success__empty">Không tìm thấy thông tin đơn hàng.</p>
            )}

            <div className="order-success__actions">
              <Link to="/" className="order-success__btn-primary">
                <ShoppingBag size={17} /> Tiếp tục mua hàng
              </Link>
              <Link to="/orders" className="order-success__btn-secondary">
                <ShoppingCart size={17} /> Xem lịch sử đơn hàng
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </div>
  );
}