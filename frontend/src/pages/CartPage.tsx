import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CartTable from "../components/cart/CartTable";
import { ArrowRight, Plus } from "lucide-react";
import axiosClient from "../api/axiosClient";
import { resolveImageUrl } from "../utils/imageUrl";
import {
  addToCart,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
  type CartResponse,
} from "../services/cartService";
import "../styles/cart.css";

export default function CartPage() {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [clearing, setClearing] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [addingRelatedId, setAddingRelatedId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const navigate = useNavigate();

  const itemCount = useMemo(
    () => cart?.items.reduce((total, item) => total + item.quantity, 0) ?? 0,
    [cart]
  );
  const selectedItems = useMemo(
    () => cart?.items.filter((item) => selectedIds.includes(item.cartItemId)) ?? [],
    [cart, selectedIds]
  );
  const selectedCount = selectedItems.reduce((total, item) => total + item.quantity, 0);
  const selectedTotal = selectedItems.reduce((total, item) => total + Number(item.totalPrice), 0);

  useEffect(() => {
    let mounted = true;

    getCart()
      .then((data) => {
        if (mounted) {
          setCart(data);
          setSelectedIds(data.items.map((item) => item.cartItemId));
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

  useEffect(() => {
    axiosClient
      .get<{ content: RelatedProduct[] }>("/products", {
        params: { page: 0, size: 4, sort: "bestseller" },
      })
      .then((response) => setRelatedProducts(response.data.content ?? []))
      .catch(() => setRelatedProducts([]));
  }, []);

  async function handleQuantityChange(cartItemId: number, quantity: number) {
    if (quantity < 1) return;

    setUpdatingId(cartItemId);
    try {
      const nextCart = await updateCartItem(cartItemId, quantity);
      setCart(nextCart);
      setError("");
    } catch {
      setError("Không thể cập nhật số lượng sản phẩm.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleRemove(cartItemId: number) {
    setUpdatingId(cartItemId);
    try {
      await removeCartItem(cartItemId);
      setCart(await getCart());
      setSelectedIds((current) => current.filter((id) => id !== cartItemId));
      setError("");
    } catch {
      setError("Không thể xóa sản phẩm khỏi giỏ hàng.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleRemoveSelected() {
    if (selectedIds.length === 0) return;
    setClearing(true);
    try {
      if (selectedIds.length === (cart?.items.length ?? 0)) {
        await clearCart();
      } else {
        await Promise.all(selectedIds.map((id) => removeCartItem(id)));
      }
      setCart(await getCart());
      setSelectedIds([]);
      setError("");
    } catch {
      setError("Không thể xóa các sản phẩm đã chọn.");
    } finally {
      setClearing(false);
    }
  }

  async function handleAddRelated(bookId: number) {
    setAddingRelatedId(bookId);
    try {
      const nextCart = await addToCart(bookId, 1);
      setCart(nextCart);
      setSelectedIds(nextCart.items.map((item) => item.cartItemId));
      setError("");
    } catch {
      setError("Không thể thêm sản phẩm vào giỏ hàng.");
    } finally {
      setAddingRelatedId(null);
    }
  }

  function handleToggleItem(cartItemId: number) {
    setSelectedIds((current) => current.includes(cartItemId)
      ? current.filter((id) => id !== cartItemId)
      : [...current, cartItemId]);
  }

  function handleToggleAll() {
    const allIds = cart?.items.map((item) => item.cartItemId) ?? [];
    setSelectedIds(selectedIds.length === allIds.length ? [] : allIds);
  }

  return (
    <div className="cart-page">
      <Header />

      <main className="cart-page__main">
        <header className="cart-page__heading">
          <div>
            <h1>Giỏ hàng của bạn</h1>
            <p>
              {loading
                ? "Đang kiểm tra giỏ hàng..."
                : itemCount > 0
                  ? `Bạn có ${itemCount} sản phẩm trong giỏ`
                  : "Giỏ hàng đang chờ những cuốn sách bạn yêu thích"}
            </p>
          </div>
          <button
            type="button"
            className="cart-page__continue"
            onClick={() => navigate("/books")}
          >
            Tiếp tục mua sách
          </button>
        </header>

        {error ? <div className="cart-page__error">{error}</div> : null}

        <div className="cart-page__layout">
          <CartTable
            items={cart?.items ?? []}
            loading={loading}
            updatingId={updatingId}
            clearing={clearing}
            selectedIds={selectedIds}
            onQuantityChange={handleQuantityChange}
            onRemove={handleRemove}
            onToggle={handleToggleItem}
            onToggleAll={handleToggleAll}
            onRemoveSelected={handleRemoveSelected}
            onBrowse={() => navigate("/books")}
          />
        </div>

        {itemCount > 0 ? (
          <div className="cart-page__checkoutRow">
            <div>
              <span>{selectedCount} sản phẩm đã chọn</span>
              <strong>{currency.format(selectedTotal)}</strong>
            </div>
            <button
              type="button"
              disabled={selectedIds.length === 0}
              onClick={() => navigate("/checkout", { state: { cartItemIds: selectedIds } })}
            >
              Thanh toán sản phẩm đã chọn <ArrowRight size={19} />
            </button>
          </div>
        ) : null}

        {relatedProducts.length > 0 ? (
          <section className="cart-related">
            <span>GỢI Ý DÀNH CHO BẠN</span>
            <h2>Có thể bạn sẽ thích</h2>
            <div className="cart-related__grid">
              {relatedProducts.map((product) => (
                <article className="cart-related__card" key={product.id}>
                  <div className="cart-related__cover">
                    {resolveImageUrl(product.imageUrl) ? (
                      <img src={resolveImageUrl(product.imageUrl)} alt={product.title} />
                    ) : (
                      <div>BookLand</div>
                    )}
                  </div>
                  <div className="cart-related__body">
                    <span>{product.categoryName || "Sách chọn lọc"}</span>
                    <h3>{product.title}</h3>
                    <p>{product.authorName || "Đang cập nhật"}</p>
                    <div>
                      <strong>{currency.format(product.price)}</strong>
                      <button
                        type="button"
                        disabled={addingRelatedId === product.id}
                        onClick={() => handleAddRelated(product.id)}
                        aria-label={`Thêm ${product.title} vào giỏ`}
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}

interface RelatedProduct {
  id: number;
  title: string;
  imageUrl?: string | null;
  price: number;
  categoryName?: string | null;
  authorName?: string | null;
}

const currency = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});
