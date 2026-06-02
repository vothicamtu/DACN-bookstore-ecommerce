import { Link, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import type { OrderResponse } from "../services/orderService";

type LocationState = {
  order?: OrderResponse;
};

export default function OrderSuccessPage() {
  const location = useLocation();
  const order = (location.state as LocationState | null)?.order;

  return (
    <div className="min-h-screen bg-[#F7F2E7]">
      <Header />

      <main className="max-w-[900px] mx-auto px-6 py-16">
        <section className="bg-white border border-[#E5D8BA] rounded-[28px] p-10 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-700">
            ✓
          </div>

          <h1 className="text-4xl font-semibold text-[#2b1f12]">
            Đặt hàng thành công
          </h1>

          <p className="mt-4 text-[#7f6a55]">
            Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được ghi nhận và đang chờ xử lý.
          </p>

          {order ? (
            <div className="mt-8 rounded-2xl border border-[#E5D8BA] bg-[#FBF6EA] p-6 text-left">
              <div className="flex justify-between">
                <span>Mã đơn hàng</span>
                <strong>#{order.orderId}</strong>
              </div>
              <div className="mt-3 flex justify-between">
                <span>Tổng tiền</span>
                <strong>{Number(order.totalAmount).toLocaleString("vi-VN")}đ</strong>
              </div>
              <div className="mt-3 flex justify-between">
                <span>Trạng thái</span>
                <strong>Đang xử lý</strong>
              </div>
            </div>
          ) : null}

          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/"
              className="rounded-2xl bg-[#767F9E] px-6 py-4 font-semibold text-white"
            >
              Tiếp tục mua hàng
            </Link>
            <Link
              to="/cart"
              className="rounded-2xl border border-[#E5D8BA] px-6 py-4 font-semibold text-[#7f6a55]"
            >
              Về giỏ hàng
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
