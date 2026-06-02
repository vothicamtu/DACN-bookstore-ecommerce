import type { CartResponse } from "../../services/cartService";
import { resolveImageUrl } from "../../utils/imageUrl";

interface Props {
  cart: CartResponse | null;
  loading: boolean;
  submitting: boolean;
  onSubmit: () => void;
}

const shippingFee = 25000;

export default function OrderSummary({
  cart,
  loading,
  submitting,
  onSubmit,
}: Props) {
  const items = cart?.items ?? [];
  const totalAmount = cart?.totalAmount ?? 0;
  const finalAmount = totalAmount > 0 ? totalAmount + shippingFee : 0;
  const disabled = loading || submitting || items.length === 0;

  return (
    <div className="bg-white rounded-[28px] border border-[#E5D8BA] p-8 sticky top-5">
      <h2 className="text-4xl font-semibold mb-8">Sản phẩm đã chọn</h2>

      <div className="space-y-5">
        {loading ? (
          <div className="text-gray-500">Đang tải giỏ hàng...</div>
        ) : items.length === 0 ? (
          <div className="text-gray-500">Không có sản phẩm trong giỏ hàng.</div>
        ) : (
          items.map((item) => (
            <div key={item.cartItemId} className="flex gap-4">
              <img
                src={resolveImageUrl(item.imageUrl) ?? "/book.jpg"}
                alt={item.title}
                className="w-20 h-24 rounded-lg object-cover"
              />

              <div>
                <h4>{item.title}</h4>
                <p>
                  {item.quantity} x {Number(item.price).toLocaleString("vi-VN")}đ
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="border-t mt-8 pt-8">
        <div className="flex justify-between">
          <span>Tạm tính</span>
          <span>{Number(totalAmount).toLocaleString("vi-VN")}đ</span>
        </div>

        <div className="flex justify-between mt-4">
          <span>Phí vận chuyển</span>
          <span>{totalAmount > 0 ? `${shippingFee.toLocaleString("vi-VN")}đ` : "0đ"}</span>
        </div>

        <div className="flex justify-between mt-6 text-3xl font-bold text-[#D09A4E]">
          <span>Tổng cộng</span>
          <span>{Number(finalAmount).toLocaleString("vi-VN")}đ</span>
        </div>

        <button
          className="w-full mt-8 bg-[#767F9E] text-white py-5 rounded-2xl font-semibold disabled:opacity-50"
          disabled={disabled}
          onClick={onSubmit}
        >
          {submitting ? "Đang đặt hàng..." : "Đặt hàng ngay"}
        </button>
      </div>
    </div>
  );
}
