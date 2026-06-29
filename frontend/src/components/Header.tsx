import '../styles/bookland.css';
import { Search, Heart, ShoppingCart, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
    CART_UPDATED_EVENT,
    getCart,
    type CartResponse,
} from '../services/cartService';
import axiosClient from '../api/axiosClient';

export type HeaderNavKey = 'store' | 'category' | 'bestseller' | 'newest';

export type HeaderCategory = {
    label: string;
    value: string;
};

interface HeaderProps {
    keyword?: string;
    setKeyword?: React.Dispatch<React.SetStateAction<string>>;
    onSearch?: () => void;
    activeNav?: HeaderNavKey;
    activeCategory?: string;
    onStoreClick?: () => void;
    onCategorySelect?: (category: string) => void;
    onBestSellerClick?: () => void;
    onNewestClick?: () => void;
    categories?: HeaderCategory[];
}

export default function Header({
                                   keyword,
                                   setKeyword,
                                   onSearch,
                                   activeNav = 'store',
                                   activeCategory = '',
                                   onStoreClick,
                                   onCategorySelect,
                                   onBestSellerClick,
                                   onNewestClick,
                                   categories = [],
                               }: HeaderProps) {
    const navigate = useNavigate();
    const [cartLoginPromptOpen, setCartLoginPromptOpen] = useState(false);
    const [cartItemCount, setCartItemCount] = useState(0);
    const [internalKeyword, setInternalKeyword] = useState("");
    const [internalCategories, setInternalCategories] = useState<HeaderCategory[]>([]);
    const currentKeyword = keyword ?? internalKeyword;
    const visibleCategories = categories.length > 0 ? categories : internalCategories;

    const hasAuthToken = () =>
        Boolean(
            localStorage.getItem("token") ||
            localStorage.getItem("authToken") ||
            localStorage.getItem("accessToken")
        );

    const handleCartClick = () => {
        if (hasAuthToken()) {
            navigate("/cart");
            return;
        }

        setCartLoginPromptOpen(true);
    };

    const handleKeywordChange = (value: string) => {
        if (setKeyword) {
            setKeyword(value);
        } else {
            setInternalKeyword(value);
        }
    };

    const handleSearch = () => {
        if (onSearch) {
            onSearch();
            return;
        }

        const search = currentKeyword.trim();
        navigate(search ? `/books?keyword=${encodeURIComponent(search)}` : "/books");
    };

    useEffect(() => {
        if (!hasAuthToken()) {
            setCartItemCount(0);
            return;
        }

        let mounted = true;

        const applyCartCount = (cart: CartResponse) => {
            if (mounted) {
                setCartItemCount(
                    cart.items.reduce((total, item) => total + item.quantity, 0)
                );
            }
        };

        const refreshCartCount = () => {
            getCart()
                .then(applyCartCount)
                .catch(() => {
                    if (mounted) {
                        setCartItemCount(0);
                    }
                });
        };

        const handleCartUpdated = (event: Event) => {
            const cart = (event as CustomEvent<{ cart?: CartResponse }>).detail?.cart;
            if (cart) {
                applyCartCount(cart);
            } else {
                refreshCartCount();
            }
        };

        refreshCartCount();
        window.addEventListener(CART_UPDATED_EVENT, handleCartUpdated);

        return () => {
            mounted = false;
            window.removeEventListener(CART_UPDATED_EVENT, handleCartUpdated);
        };
    }, []);

    useEffect(() => {
        if (categories.length > 0) return;

        axiosClient
            .get<Array<{ categoryName: string }>>("/categories")
            .then((response) => {
                setInternalCategories(
                    response.data.map((category) => ({
                        label: category.categoryName,
                        value: category.categoryName,
                    }))
                );
            })
            .catch(() => setInternalCategories([]));
    }, [categories.length]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("authToken");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <>
            <header className="bookland-header">
                <button
                    type="button"
                    className="bookland-header__brand"
                    onClick={() => navigate("/books")}
                    aria-label="Về cửa hàng BookLand"
                >
                    <span className="bookland-header__logo">BookLand</span>
                </button>

            <nav className="bookland-header__nav" aria-label="Điều hướng chính">
                <button
                    type="button"
                    className={`bookland-header__link ${activeNav === 'store' ? 'is-active' : ''}`}
                    onClick={() => onStoreClick ? onStoreClick() : navigate("/books")}
                >
                    Cửa hàng
                </button>

                <div className="bookland-header__dropdown">
                    <button
                        type="button"
                        className={`bookland-header__link ${activeNav === 'category' ? 'is-active' : ''}`}
                    >
                        Danh mục
                    </button>
                    <div className="bookland-header__dropdownMenu">
                        {visibleCategories.length === 0 ? (
                            <span className="bookland-header__dropdownEmpty">
                                Chưa có danh mục
                            </span>
                        ) : null}

                        {visibleCategories.map((category) => (
                            <button
                                key={category.value}
                                type="button"
                                className={`bookland-header__dropdownItem ${activeCategory === category.value ? 'is-active' : ''}`}
                                onClick={() => onCategorySelect
                                    ? onCategorySelect(category.value)
                                    : navigate(`/books?category=${encodeURIComponent(category.value)}`)}
                            >
                                {category.label}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    type="button"
                    className={`bookland-header__link ${activeNav === 'bestseller' ? 'is-active' : ''}`}
                    onClick={() => onBestSellerClick
                        ? onBestSellerClick()
                        : navigate("/books?sort=bestseller")}
                >
                    Bán chạy
                </button>

                <button
                    type="button"
                    className={`bookland-header__link ${activeNav === 'newest' ? 'is-active' : ''}`}
                    onClick={() => onNewestClick
                        ? onNewestClick()
                        : navigate("/books?sort=newest")}
                >
                    Sách mới
                </button>
            </nav>

            <div className="bookland-header__actions">
                <label className="bookland-search" aria-label="Tìm kiếm sách">
                    <input
                        type="search"
                        placeholder="Tìm kiếm sách..."
                        value={currentKeyword}
                        onChange={(e) => handleKeywordChange(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch();
                            }
                        }}
                    />

                    <button
                        type="button"
                        className="bookland-search__icon"
                        onClick={handleSearch}
                    >
                        <Search className="bookland-icon" />
                    </button>
                </label>

                <button
                    type="button"
                    className="bookland-header__iconButton"
                    aria-label="Yêu thích"
                >
                    <Heart className="bookland-icon" />
                </button>

                <div className="bookland-header__cartWrap">
                    <button
                        type="button"
                        className="bookland-header__iconButton"
                        aria-label={`Giỏ hàng${cartItemCount > 0 ? `, ${cartItemCount} sản phẩm` : ""}`}
                        onClick={handleCartClick}
                    >
                        <ShoppingCart className="bookland-icon" />
                    </button>
                    {cartItemCount > 0 ? (
                        <span className="bookland-header__cartBadge" aria-hidden="true">
                            {cartItemCount > 99 ? "99+" : cartItemCount}
                        </span>
                    ) : null}
                </div>

                <div className="bookland-header__account">
                    <button
                        type="button"
                        className="bookland-header__iconButton"
                        aria-label="Tài khoản"
                        aria-haspopup="menu"
                    >
                        <User className="bookland-icon" />
                    </button>
                    <div className="bookland-header__accountMenu" role="menu">
                        {hasAuthToken() ? (
                            <>
                                <Link to="/orders" className="bookland-header__accountLink" role="menuitem">
                                    Lịch sử đơn hàng
                                </Link>
                                <button
                                    type="button"
                                    className="bookland-header__accountLink bookland-header__accountButton"
                                    role="menuitem"
                                    onClick={handleLogout}
                                >
                                    Đăng xuất
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="bookland-header__accountLink" role="menuitem">
                                    Đăng nhập
                                </Link>
                                <Link to="/register" className="bookland-header__accountLink" role="menuitem">
                                    Đăng ký
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
            </header>

            {cartLoginPromptOpen ? (
                <div className="bookland-loginPrompt" role="dialog" aria-modal="true" aria-labelledby="cartLoginPromptTitle">
                    <div className="bookland-loginPrompt__panel">
                        <h2 id="cartLoginPromptTitle">Cần đăng nhập</h2>
                        <p>Bạn cần đăng nhập trước khi xem giỏ hàng.</p>
                        <div className="bookland-loginPrompt__actions">
                            <button type="button" onClick={() => setCartLoginPromptOpen(false)}>
                                Đóng
                            </button>
                            <a href="/login">Đăng nhập</a>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
}
