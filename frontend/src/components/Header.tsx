import '../styles/bookland.css';
import { Search, Heart, ShoppingCart, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

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
                                   keyword = "",
                                   setKeyword = () => {},
                                   onSearch = () => {},
                                   activeNav = 'store',
                                   activeCategory = '',
                                   onStoreClick = () => {},
                                   onCategorySelect = () => {},
                                   onBestSellerClick = () => {},
                                   onNewestClick = () => {},
                                   categories = [],
                               }: HeaderProps) {
    const navigate = useNavigate();
    const [cartLoginPromptOpen, setCartLoginPromptOpen] = useState(false);

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

    return (
        <>
            <header className="bookland-header">
                <div className="bookland-header__brand">
                    <span className="bookland-header__logo">BookLand</span>
                </div>

            <nav className="bookland-header__nav" aria-label="Điều hướng chính">
                <button
                    type="button"
                    className={`bookland-header__link ${activeNav === 'store' ? 'is-active' : ''}`}
                    onClick={onStoreClick}
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
                        {categories.length === 0 ? (
                            <span className="bookland-header__dropdownEmpty">
                                Chưa có danh mục
                            </span>
                        ) : null}

                        {categories.map((category) => (
                            <button
                                key={category.value}
                                type="button"
                                className={`bookland-header__dropdownItem ${activeCategory === category.value ? 'is-active' : ''}`}
                                onClick={() => onCategorySelect(category.value)}
                            >
                                {category.label}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    type="button"
                    className={`bookland-header__link ${activeNav === 'bestseller' ? 'is-active' : ''}`}
                    onClick={onBestSellerClick}
                >
                    Bán chạy
                </button>

                <button
                    type="button"
                    className={`bookland-header__link ${activeNav === 'newest' ? 'is-active' : ''}`}
                    onClick={onNewestClick}
                >
                    Sách mới
                </button>
            </nav>

            <div className="bookland-header__actions">
                <label className="bookland-search" aria-label="Tìm kiếm sách">
                    <input
                        type="search"
                        placeholder="Tìm kiếm sách..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                onSearch();
                            }
                        }}
                    />

                    <button
                        type="button"
                        className="bookland-search__icon"
                        onClick={onSearch}
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

                <button
                    type="button"
                    className="bookland-header__iconButton"
                    aria-label="Giỏ hàng"
                    onClick={handleCartClick}
                >
                    <ShoppingCart className="bookland-icon" />
                </button>

                <button
                    type="button"
                    className="bookland-header__iconButton"
                    aria-label="Tài khoản"
                >
                    <User className="bookland-icon" />
                </button>
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
