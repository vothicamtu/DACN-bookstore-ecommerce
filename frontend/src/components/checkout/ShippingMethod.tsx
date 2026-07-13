import { Check } from "lucide-react";

export type ShippingMethodValue = "standard" | "express";

interface Props {
  value: ShippingMethodValue;
  onChange: (value: ShippingMethodValue) => void;
}

const methods: Array<{
  value: ShippingMethodValue;
  title: string;
  description: string;
  fee: string;
}> = [
  { value: "standard", title: "Tiêu chuẩn", description: "Dự kiến giao 2–4 ngày", fee: "25.000đ" },
  { value: "express", title: "Hỏa tốc", description: "Giao trong ngày", fee: "50.000đ" },
];

export default function ShippingMethod({ value, onChange }: Props) {
  return (
    <section className="checkout-card">
      <h2>Phương thức vận chuyển</h2>
      <div className="checkout-shippingGrid">
        {methods.map((method) => (
          <button
            key={method.value}
            type="button"
            className={value === method.value ? "is-selected" : ""}
            onClick={() => onChange(method.value)}
          >
            <span className="checkout-optionCheck">
              {value === method.value ? <Check size={14} /> : null}
            </span>
            <strong>{method.title}</strong>
            <small>{method.description}</small>
            <b>{method.fee}</b>
          </button>
        ))}
      </div>
    </section>
  );
}
