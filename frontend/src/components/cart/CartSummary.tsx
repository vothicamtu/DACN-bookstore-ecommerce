import { ArrowRight, ShieldCheck, Truck } from "lucide-react";

interface Props {
  itemCount: number;
  totalAmount: number;
  disabled: boolean;
  onCheckout: () => void;
}

const shippingFee = 25000;
const currency = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

export default function CartSummary({
  itemCount,
  totalAmount,
  disabled,
  onCheckout,
}: Props) {
  const finalAmount = totalAmount > 0 ? totalAmount + shippingFee : 0;

  return (
    <aside className="cart-summary">
      <div className="cart-summary__top">
        <span>ĐƠN HÀNG CỦA BẠN</span>
        <h2>Tóm tắt giỏ hàng</h2>
      </div>

      <div className="cart-summary__rows">
        <div>
          <span>Sản phẩm</span>
          <strong>{itemCount}</strong>
        </div>
        <div>
          <span>Tạm tính</span>
          <strong>{currency.format(totalAmount)}</strong>
        </div>
        <div>
          <span>Phí vận chuyển</span>
          <strong>{totalAmount > 0 ? currency.format(shippingFee) : currency.format(0)}</strong>
        </div>
      </div>

      <div className="cart-summary__total">
        <span>Tổng cộng</span>
        <strong>{currency.format(finalAmount)}</strong>
        <small>Đã bao gồm thuế (nếu có)</small>
      </div>

      <button
        type="button"
        className="cart-summary__checkout"
        disabled={disabled}
        onClick={onCheckout}
      >
        Tiến hành đặt hàng <ArrowRight size={19} />
      </button>

      <div className="cart-summary__benefits">
        <p><ShieldCheck size={18} /> Thanh toán an toàn</p>
        <p><Truck size={18} /> Giao hàng toàn quốc</p>
      </div>
    </aside>
  );
}
