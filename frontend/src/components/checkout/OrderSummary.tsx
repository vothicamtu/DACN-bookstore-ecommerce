import { ArrowRight } from "lucide-react";
import type { CartResponse } from "../../services/cartService";
import type { ShippingMethodValue } from "./ShippingMethod";
import { resolveImageUrl } from "../../utils/imageUrl";
import { Link } from "react-router-dom";

interface Props {
  cart: CartResponse | null;
  loading: boolean;
  submitting: boolean;
  shippingMethod: ShippingMethodValue;
  acceptedTerms: boolean;
  onAcceptedTermsChange: (accepted: boolean) => void;
  onSubmit: () => void;
}

const currency = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

export default function OrderSummary({
  cart,
  loading,
  submitting,
  shippingMethod,
  acceptedTerms,
  onAcceptedTermsChange,
  onSubmit,
}: Props) {
  const items = cart?.items ?? [];
  const subtotal = cart?.totalAmount ?? 0;
  const shippingFee = subtotal > 0 ? (shippingMethod === "express" ? 50000 : 25000) : 0;
  const finalAmount = subtotal + shippingFee;
  const disabled = loading || submitting || items.length === 0;

  return (
    <aside className="checkout-summary">
      <h2>Sản phẩm đã chọn</h2>
      <div className="checkout-summary__items">
        {loading ? <p>Đang tải giỏ hàng...</p> : items.length === 0 ? (
          <p>Không có sản phẩm trong giỏ hàng.</p>
        ) : items.map((item) => (
          <article key={item.cartItemId}>
            <div className="checkout-summary__cover">
              {resolveImageUrl(item.imageUrl) ? (
                <img src={resolveImageUrl(item.imageUrl)} alt={item.title} />
              ) : <span>BookLand</span>}
            </div>
            <div>
              <strong>{item.title}</strong>
              <small>SL: {item.quantity}</small>
              <b>{currency.format(item.totalPrice)}</b>
            </div>
          </article>
        ))}
      </div>
      <div className="checkout-summary__coupon">
        <input placeholder="Mã giảm giá" />
        <button type="button">Áp dụng</button>
      </div>
      <div className="checkout-summary__prices">
        <div><span>Tạm tính</span><strong>{currency.format(subtotal)}</strong></div>
        <div><span>Giảm giá</span><strong>− {currency.format(0)}</strong></div>
        <div><span>Phí vận chuyển</span><strong>{currency.format(shippingFee)}</strong></div>
      </div>
      <div className="checkout-summary__total">
        <span>Tổng cộng</span>
        <strong>{currency.format(finalAmount)}</strong>
      </div>
      <label className="checkout-summary__terms">
        <input
          type="checkbox"
          checked={acceptedTerms}
          onChange={(event) => onAcceptedTermsChange(event.target.checked)}
        />
        <span>
          Tôi đã đọc và đồng ý với{" "}
          <Link to="/terms-and-privacy#terms" target="_blank" rel="noreferrer">điều khoản dịch vụ</Link>{" "}
          và{" "}
          <Link to="/terms-and-privacy#privacy" target="_blank" rel="noreferrer">chính sách bảo mật</Link>.
        </span>
      </label>
      <button
        type="button"
        className="checkout-summary__submit"
        disabled={disabled}
        onClick={onSubmit}
      >
        {submitting ? "Đang đặt hàng..." : "Đặt hàng ngay"}
        {!submitting ? <ArrowRight size={20} /> : null}
      </button>
    </aside>
  );
}
