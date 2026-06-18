export type PaymentMethodValue = "cod" | "momo" | "credit" | "banking";

const payments: { value: PaymentMethodValue; label: string }[] = [
  { value: "cod", label: "Thanh toÃ¡n khi nháº­n hÃ ng" },
  { value: "momo", label: "VÃ­ MoMo" },
  { value: "credit", label: "Tháº» tÃ­n dá»¥ng" },
  { value: "banking", label: "Chuyá»ƒn khoáº£n ngÃ¢n hÃ ng" },
];

interface Props {
  value: PaymentMethodValue;
  onChange: (value: PaymentMethodValue) => void;
}

export default function PaymentMethod({ value, onChange }: Props) {
  return (
    <div className="bg-white rounded-[28px] border border-[#E5D8BA] p-8">
      <h2 className="text-4xl font-semibold mb-8">PhÆ°Æ¡ng thá»©c thanh toÃ¡n</h2>

      <div className="space-y-4">
        {payments.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => onChange(item.value)}
            className={`
            w-full text-left p-5 rounded-xl border cursor-pointer

            ${value === item.value ? "border-[#A46A1F]" : "border-[#E5D8BA]"}
            `}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
