import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import RecipientForm, { type RecipientFormValue } from "../components/checkout/RecipientForm";
import ShippingMethod, { type ShippingMethodValue } from "../components/checkout/ShippingMethod";
import PaymentMethod, { type PaymentMethodValue } from "../components/checkout/PaymentMethod";
import OrderNote from "../components/checkout/OrderNote";
import OrderSummary from "../components/checkout/OrderSummary";
import { getCart, type CartResponse } from "../services/cartService";
import { createOrder } from "../services/orderService";
import axios from "axios";
import "../styles/checkout.css";

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
  const [shippingMethod, setShippingMethod] = useState<ShippingMethodValue>("standard");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodValue>("cod");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const requestedCartItemIds = (location.state as { cartItemIds?: number[] } | null)?.cartItemIds;

  useEffect(() => {
    let mounted = true;

    getCart()
      .then((data) => {
        if (mounted) {
          if (requestedCartItemIds?.length) {
            const selectedItems = data.items.filter((item) =>
              requestedCartItemIds.includes(item.cartItemId)
            );
            setCart({
              ...data,
              items: selectedItems,
              totalAmount: selectedItems.reduce(
                (total, item) => total + Number(item.totalPrice),
                0
              ),
            });
          } else {
            setCart(data);
          }
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

    if (
      !recipient.fullName.trim() ||
      !recipient.email.trim() ||
      !recipient.phoneNumber.trim() ||
      !shippingAddress.trim()
    ) {
      setError("Vui lòng nhập họ tên, email, số điện thoại và địa chỉ nhận hàng.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const order = await createOrder({
        customerName: recipient.fullName,
        customerEmail: recipient.email,
        shippingAddress,
        phoneNumber: recipient.phoneNumber,
        shippingMethod,
        paymentMethod,
        note,
        cartItemIds: cart?.items.map((item) => item.cartItemId),
      });
      navigate("/checkout/success", { state: { order } });
    } catch (requestError) {
      if (axios.isAxiosError(requestError)) {
        const responseData = requestError.response?.data;
        const validationMessage = responseData && typeof responseData === "object"
          ? Object.values(responseData).find((value): value is string => typeof value === "string")
          : undefined;

        if (requestError.response?.status === 401 || requestError.response?.status === 403) {
          setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại trước khi đặt hàng.");
        } else {
          setError(responseData?.message || validationMessage || "Không thể đặt hàng. Vui lòng thử lại.");
        }
      } else {
        setError("Không thể đặt hàng. Vui lòng thử lại.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="checkout-page">
      <Header />

      <main className="checkout-page__main">
        {error ? (
          <div className="checkout-page__error">{error}</div>
        ) : null}

        <div className="checkout-page__layout">
          <div className="checkout-page__forms">
            <RecipientForm value={recipient} onChange={setRecipient} />
            <ShippingMethod value={shippingMethod} onChange={setShippingMethod} />
            <PaymentMethod value={paymentMethod} onChange={setPaymentMethod} />
            <OrderNote value={note} onChange={setNote} />
          </div>

          <OrderSummary
            cart={cart}
            loading={loading}
            submitting={submitting}
            shippingMethod={shippingMethod}
            acceptedTerms={acceptedTerms}
            onAcceptedTermsChange={setAcceptedTerms}
            onSubmit={handleSubmit}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
