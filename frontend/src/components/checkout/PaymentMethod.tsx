import { Banknote, CreditCard, Landmark, WalletCards } from "lucide-react";

export type PaymentMethodValue = "cod" | "momo" | "credit" | "banking";

const payments = [
  { value: "cod" as const, label: "Thanh toán khi nhận hàng (COD)", icon: Banknote },
  { value: "momo" as const, label: "Ví điện tử MoMo / ZaloPay", icon: WalletCards },
  { value: "credit" as const, label: "Thẻ tín dụng (Visa, Mastercard, JCB)", icon: CreditCard },
  { value: "banking" as const, label: "Thẻ ATM / Internet Banking", icon: Landmark },
];

interface Props {
  value: PaymentMethodValue;
  onChange: (value: PaymentMethodValue) => void;
}

export default function PaymentMethod({ value, onChange }: Props) {
  return (
    <section className="checkout-card">
      <h2>Phương thức thanh toán</h2>
      <div className="checkout-paymentList">
        {payments.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.value}
              type="button"
              className={value === item.value ? "is-selected" : ""}
              onClick={() => onChange(item.value)}
            >
              <Icon size={20} />
              <span>{item.label}</span>
              <i />
            </button>
          );
        })}
      </div>
    </section>
  );
}
