import '../styles/bookland.css';
import { Search, Heart, ShoppingCart, User } from 'lucide-react';

const navItems = ['Cửa hàng', 'Danh mục', 'Bán chạy', 'Sách mới'];

interface HeaderProps {
    keyword: string;
    setKeyword: React.Dispatch<React.SetStateAction<string>>;
    onSearch: () => void;
}

export default function Header({
                                   keyword,
                                   setKeyword,
                                   onSearch,
                               }: HeaderProps) {
    return (
        <header className="bookland-header">
            <div className="bookland-header__brand">
                <span className="bookland-header__logo">BookLand</span>
            </div>

            <nav className="bookland-header__nav" aria-label="Điều hướng chính">
                {navItems.map((item) => (
                    <a key={item} href="#" className="bookland-header__link">
                        {item}
                    </a>
                ))}
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
    );
}