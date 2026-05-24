import '../styles/bookland.css';
import { Search, Heart, ShoppingCart, User } from 'lucide-react';

const navItems = ['Cửa hàng', 'Danh mục', 'Bán chạy', 'Sách mới'];

export default function Header() {
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
          <input type="search" placeholder="Tìm kiếm sách..." />
          <span className="bookland-search__icon" aria-hidden="true">
            <Search className="bookland-icon" />
          </span>
        </label>

        <button type="button" className="bookland-header__iconButton" aria-label="Yêu thích">
          <Heart className="bookland-icon" />
        </button>

        <button type="button" className="bookland-header__iconButton" aria-label="Giỏ hàng">
          <ShoppingCart className="bookland-icon" />
        </button>

        <button type="button" className="bookland-header__iconButton" aria-label="Tài khoản">
          <User className="bookland-icon" />
        </button>
      </div>
    </header>
  );
}