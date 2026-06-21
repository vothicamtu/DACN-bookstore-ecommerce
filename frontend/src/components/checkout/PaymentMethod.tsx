import { useState } from "react";

const payments = [
  { value: "cod", label: "Thanh toán khi nhận hàng" },
  { value: "momo", label: "Ví MoMo" },
  { value: "credit", label: "Thẻ tín dụng" },
  { value: "banking", label: "Chuyển khoản ngân hàng" },
];

export default function PaymentMethod() {
  const [method, setMethod] = useState("cod");

  return (
    <div className="bg-white rounded-[28px] border border-[#E5D8BA] p-8">
      <h2 className="text-4xl font-semibold mb-8">Phương thức thanh toán</h2>

      <div className="space-y-4">
        {payments.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setMethod(item.value)}
            className={`
            w-full text-left p-5 rounded-xl border cursor-pointer

            ${method === item.value ? "border-[#A46A1F]" : "border-[#E5D8BA]"}
            `}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
