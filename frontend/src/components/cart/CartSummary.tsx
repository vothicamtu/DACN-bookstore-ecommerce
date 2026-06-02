interface Props {
  totalAmount: number;
  disabled: boolean;
  onCheckout: () => void;
}

const shippingFee = 25000;

export default function CartSummary({
  totalAmount,
  disabled,
  onCheckout,
}: Props) {
  const finalAmount = totalAmount > 0 ? totalAmount + shippingFee : 0;

  return (
    <div className="bg-white border border-[#E5D8BA] rounded-[28px] p-8 sticky top-5">
      <h2 className="text-3xl font-semibold mb-8">Tóm tắt đơn hàng</h2>

      <div className="flex gap-3">
        <input
          placeholder="Mã giảm giá"
          className="flex-1 border border-[#E5D8BA] rounded-xl px-4"
        />

        <button className="bg-[#A46A1F] text-white px-6 rounded-xl">
          Áp dụng
        </button>
      </div>

      <div className="space-y-4 mt-8">
        <div className="flex justify-between">
          <span>Tạm tính</span>
          <span>{Number(totalAmount).toLocaleString("vi-VN")}đ</span>
        </div>

        <div className="flex justify-between">
          <span>Giảm giá</span>
          <span>0đ</span>
        </div>

        <div className="flex justify-between">
          <span>Phí vận chuyển</span>
          <span>{totalAmount > 0 ? `${shippingFee.toLocaleString("vi-VN")}đ` : "0đ"}</span>
        </div>
      </div>

      <div className="border-t mt-8 pt-8">
        <div className="flex justify-between text-3xl font-bold text-[#D09A4E]">
          <span>Tổng cộng</span>
          <span>{Number(finalAmount).toLocaleString("vi-VN")}đ</span>
        </div>
      </div>

      <button
        className="w-full mt-8 py-5 rounded-2xl bg-[#767F9E] text-white text-xl font-semibold disabled:opacity-50"
        disabled={disabled}
        onClick={onCheckout}
      >
        Tiến hành đặt hàng
      </button>
    </div>
  );
}
