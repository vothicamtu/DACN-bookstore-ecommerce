import CartItem from "./CartItem";
import type { CartItemResponse } from "../../services/cartService";

interface Props {
  items: CartItemResponse[];
  loading: boolean;
  error: string;
  updatingId: number | null;
  onQuantityChange: (cartItemId: number, quantity: number) => void;
  onRemove: (cartItemId: number) => void;
}

export default function CartTable({
  items,
  loading,
  error,
  updatingId,
  onQuantityChange,
  onRemove,
}: Props) {
  return (
    <div className="bg-white border border-[#E5D8BA] rounded-[28px] p-8">
      <h2 className="text-4xl font-semibold mb-8">Giỏ hàng của bạn</h2>

      <div className="grid grid-cols-12 font-semibold pb-4 border-b border-[#E5D8BA]">
        <div className="col-span-6">Sản phẩm</div>
        <div className="col-span-2">Đơn giá</div>
        <div className="col-span-2">Số lượng</div>
        <div className="col-span-2">Thành tiền</div>
      </div>

      {loading ? (
        <div className="py-10 text-center text-gray-500">Đang tải giỏ hàng...</div>
      ) : error ? (
        <div className="py-10 text-center text-red-600">{error}</div>
      ) : items.length === 0 ? (
        <div className="py-10 text-center text-gray-500">Giỏ hàng đang trống.</div>
      ) : (
        items.map((item) => (
          <CartItem
            key={item.cartItemId}
            item={item}
            disabled={updatingId === item.cartItemId}
            onQuantityChange={onQuantityChange}
            onRemove={onRemove}
          />
        ))
      )}
    </div>
  );
}
