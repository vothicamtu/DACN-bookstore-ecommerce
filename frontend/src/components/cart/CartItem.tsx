import type { CartItemResponse } from "../../services/cartService";
import { resolveImageUrl } from "../../utils/imageUrl";

interface Props {
  item: CartItemResponse;
  disabled: boolean;
  onQuantityChange: (cartItemId: number, quantity: number) => void;
  onRemove: (cartItemId: number) => void;
}

export default function CartItem({
  item,
  disabled,
  onQuantityChange,
  onRemove,
}: Props) {
  const imageUrl = resolveImageUrl(item.imageUrl);

  return (
    <div className="grid grid-cols-12 gap-4 items-center border-b border-[#E5D8BA] py-6">
      <div className="col-span-6 flex gap-4">
        <img
          src={imageUrl ?? "/book.jpg"}
          alt={item.title}
          className="w-24 h-32 object-cover rounded-xl"
        />

        <div>
          <h3 className="font-semibold">{item.title}</h3>
        </div>
      </div>

      <div className="col-span-2">{Number(item.price).toLocaleString("vi-VN")}đ</div>

      <div className="col-span-2">
        <div className="flex items-center border rounded-xl w-fit">
          <button
            type="button"
            className="px-3 py-2 disabled:opacity-50"
            disabled={disabled || item.quantity <= 1}
            onClick={() => onQuantityChange(item.cartItemId, item.quantity - 1)}
          >
            -
          </button>

          <span className="px-4">{item.quantity}</span>

          <button
            type="button"
            className="px-3 py-2 disabled:opacity-50"
            disabled={disabled}
            onClick={() => onQuantityChange(item.cartItemId, item.quantity + 1)}
          >
            +
          </button>
        </div>
      </div>

      <div className="col-span-2 flex justify-between">
        <span className="font-semibold">
          {Number(item.totalPrice).toLocaleString("vi-VN")}đ
        </span>

        <button
          type="button"
          className="text-red-500 disabled:opacity-50"
          disabled={disabled}
          onClick={() => onRemove(item.cartItemId)}
          aria-label="Xóa sản phẩm"
        >
          Xóa
        </button>
      </div>
    </div>
  );
}
