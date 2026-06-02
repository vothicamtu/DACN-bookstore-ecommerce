import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CheckoutSteps from "../components/checkout/CheckoutSteps";
import RecipientForm, { type RecipientFormValue } from "../components/checkout/RecipientForm";
import ShippingMethod from "../components/checkout/ShippingMethod";
import PaymentMethod from "../components/checkout/PaymentMethod";
import OrderNote from "../components/checkout/OrderNote";
import OrderSummary from "../components/checkout/OrderSummary";
import { getCart, type CartResponse } from "../services/cartService";
import { createOrder } from "../services/orderService";

const initialRecipient: RecipientFormValue = {
  fullName: "",
  phoneNumber: "",
  email: "",
  address: "",
  city: "TP Hồ Chí Minh",
  district: "",
};

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [recipient, setRecipient] = useState<RecipientFormValue>(initialRecipient);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    getCart()
      .then((data) => {
        if (mounted) {
          setCart(data);
        }
      })
      .catch(() => {
        if (mounted) {
          setError("Không thể tải giỏ hàng. Vui lòng đăng nhập và thử lại.");
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  async function handleSubmit() {
    const shippingAddress = [
      recipient.address,
      recipient.district,
      recipient.city,
    ].filter(Boolean).join(", ");

    if (!recipient.phoneNumber.trim() || !shippingAddress.trim()) {
      setError("Vui lòng nhập số điện thoại và địa chỉ nhận hàng.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const order = await createOrder({
        shippingAddress,
        phoneNumber: recipient.phoneNumber,
        note,
      });
      navigate("/checkout/success", { state: { order } });
    } catch {
      setError("Không thể đặt hàng. Vui lòng kiểm tra giỏ hàng và thử lại.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F2E7]">
      <Header />

      <div className="max-w-[1400px] mx-auto px-6 py-10">
        <CheckoutSteps />

        {error ? (
          <div className="mt-8 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
            {error}
          </div>
        ) : null}

        <div className="grid grid-cols-12 gap-8 mt-10">
          <div className="col-span-8 space-y-8">
            <RecipientForm value={recipient} onChange={setRecipient} />
            <ShippingMethod />
            <PaymentMethod />
            <OrderNote value={note} onChange={setNote} />
          </div>

          <div className="col-span-4">
            <OrderSummary
              cart={cart}
              loading={loading}
              submitting={submitting}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
