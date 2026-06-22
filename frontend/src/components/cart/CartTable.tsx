import { ShoppingBag, Trash2 } from "lucide-react";
import CartItem from "./CartItem";
import type { CartItemResponse } from "../../services/cartService";

interface Props {
  items: CartItemResponse[];
  loading: boolean;
  updatingId: number | null;
  clearing: boolean;
  selectedIds: number[];
  onQuantityChange: (cartItemId: number, quantity: number) => void;
  onRemove: (cartItemId: number) => void;
  onToggle: (cartItemId: number) => void;
  onToggleAll: () => void;
  onRemoveSelected: () => void;
  onBrowse: () => void;
}

export default function CartTable({
  items,
  loading,
  updatingId,
  clearing,
  selectedIds,
  onQuantityChange,
  onRemove,
  onToggle,
  onToggleAll,
  onRemoveSelected,
  onBrowse,
}: Props) {
  return (
    <section className="cart-list" aria-label="Sản phẩm trong giỏ hàng">
      <div className="cart-list__toolbar">
        <div>
          <button
            type="button"
            className={`cart-list__selectMark ${selectedIds.length === items.length && items.length > 0 ? "is-selected" : ""}`}
            onClick={onToggleAll}
            aria-label="Chọn tất cả sản phẩm"
          >
            {selectedIds.length === items.length && items.length > 0 ? "✓" : ""}
          </button>
          <strong>Chọn tất cả</strong>
          <span>Đã chọn {selectedIds.length}/{items.length} sản phẩm</span>
        </div>
        {items.length > 0 ? (
          <button type="button" onClick={onRemoveSelected} disabled={clearing || selectedIds.length === 0}>
            <Trash2 size={17} />
            {clearing ? "Đang xóa..." : "Xóa đã chọn"}
          </button>
        ) : null}
      </div>

      {loading ? (
        <div className="cart-list__state">
          <span className="cart-list__loader" />
          <p>Đang tải giỏ hàng...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="cart-list__state cart-list__state--empty">
          <div className="cart-list__emptyIcon"><ShoppingBag /></div>
          <h2>Giỏ hàng đang trống</h2>
          <p>Khám phá kho sách và chọn cho mình một cuốn thật hay nhé.</p>
          <button type="button" className="cart-list__browse" onClick={onBrowse}>
            Khám phá sách
          </button>
        </div>
      ) : (
        <div className="cart-list__items">
          {items.map((item) => (
            <CartItem
              key={item.cartItemId}
              item={item}
              disabled={updatingId === item.cartItemId || clearing}
              selected={selectedIds.includes(item.cartItemId)}
              onQuantityChange={onQuantityChange}
              onRemove={onRemove}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </section>
  );
}
