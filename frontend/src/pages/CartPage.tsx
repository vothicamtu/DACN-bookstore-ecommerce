import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CartSteps from "../components/cart/CartSteps";
import CartTable from "../components/cart/CartTable";
import CartSummary from "../components/cart/CartSummary";
import {
  getCart,
  removeCartItem,
  updateCartItem,
  type CartResponse,
} from "../services/cartService";

export default function CartPage() {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    getCart()
      .then((data) => {
        if (mounted) {
          setCart(data);
          setError("");
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

  async function handleQuantityChange(cartItemId: number, quantity: number) {
    if (quantity < 1) {
      return;
    }

    setUpdatingId(cartItemId);

    try {
      const nextCart = await updateCartItem(cartItemId, quantity);
      setCart(nextCart);
      setError("");
    } catch {
      setError("Không thể cập nhật số lượng.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleRemove(cartItemId: number) {
    setUpdatingId(cartItemId);

    try {
      await removeCartItem(cartItemId);
      const nextCart = await getCart();
      setCart(nextCart);
      setError("");
    } catch {
      setError("Không thể xóa sản phẩm khỏi giỏ hàng.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F2E7]">
      <Header keyword="" setKeyword={() => {}} onSearch={() => {}} />

      <div className="max-w-[1400px] mx-auto px-6 py-10">
        <CartSteps />

        <div className="grid grid-cols-12 gap-8 mt-10">
          <div className="col-span-8">
            <CartTable
              items={cart?.items ?? []}
              loading={loading}
              error={error}
              updatingId={updatingId}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemove}
            />
          </div>

          <div className="col-span-4">
            <CartSummary
              totalAmount={cart?.totalAmount ?? 0}
              disabled={loading || !cart || cart.items.length === 0}
              onCheckout={() => navigate("/checkout")}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
