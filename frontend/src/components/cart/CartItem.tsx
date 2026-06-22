import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartItemResponse } from "../../services/cartService";
import { resolveImageUrl } from "../../utils/imageUrl";

interface Props {
  item: CartItemResponse;
  disabled: boolean;
  selected: boolean;
  onQuantityChange: (cartItemId: number, quantity: number) => void;
  onRemove: (cartItemId: number) => void;
  onToggle: (cartItemId: number) => void;
}

const currency = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

export default function CartItem({
  item,
  disabled,
  selected,
  onQuantityChange,
  onRemove,
  onToggle,
}: Props) {
  const imageUrl = resolveImageUrl(item.imageUrl);

  return (
    <article className={`cart-item ${disabled ? "is-updating" : ""}`}>
      <label className="cart-item__checkbox">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggle(item.cartItemId)}
          aria-label={`Chọn ${item.title}`}
        />
        <span>✓</span>
      </label>
      <div className="cart-item__cover">
        {imageUrl ? (
          <img src={imageUrl} alt={item.title} />
        ) : (
          <div className="cart-item__placeholder">BookLand</div>
        )}
      </div>

      <div className="cart-item__content">
        <span className="cart-item__label">SÁCH BOOKLAND</span>
        <h2>{item.title}</h2>
        <p className="cart-item__unitPrice">Đơn giá: {currency.format(item.price)}</p>

        <div className="cart-item__bottom">
          <div className="cart-item__quantity" aria-label={`Số lượng ${item.quantity}`}>
            <button
              type="button"
              disabled={disabled || item.quantity <= 1}
              onClick={() => onQuantityChange(item.cartItemId, item.quantity - 1)}
              aria-label="Giảm số lượng"
            >
              <Minus size={16} />
            </button>
            <span>{item.quantity}</span>
            <button
              type="button"
              disabled={disabled}
              onClick={() => onQuantityChange(item.cartItemId, item.quantity + 1)}
              aria-label="Tăng số lượng"
            >
              <Plus size={16} />
            </button>
          </div>

          <strong className="cart-item__total">{currency.format(item.totalPrice)}</strong>
        </div>
      </div>

      <button
        type="button"
        className="cart-item__remove"
        disabled={disabled}
        onClick={() => onRemove(item.cartItemId)}
        aria-label={`Xóa ${item.title} khỏi giỏ hàng`}
      >
        <Trash2 size={19} />
      </button>
    </article>
  );
}
