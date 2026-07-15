import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import bookApi, { Book } from '../api/bookApi';
import '../styles/home.css';

export default function Home(): React.JSX.Element {
    const navigate = useNavigate();
    const [newBooks, setNewBooks] = useState<Book[]>([]);
    const [bestSellers, setBestSellers] = useState<Book[]>([]);
    const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                const [newRes, bestRes, allRes] = await Promise.all([
                    bookApi.getNewest(4),
                    bookApi.getBestSellers(4),
                    bookApi.getAll({ size: 4 }) // Lấy tạm 4 cuốn làm "Nổi bật"
                ]);
                if (newRes.data.success) setNewBooks(newRes.data.data.content);
                if (bestRes.data.success) setBestSellers(bestRes.data.data.content);
                if (allRes.data.success) featuredBooks.length === 0 && setFeaturedBooks(allRes.data.data.content);
            } catch (e) { console.error(e); }
        };
        loadData();
    }, []);

    const categories = [
        { id: 1, name: 'Bí ẩn', icon: '🔍' },
        { id: 2, name: 'Kịch tính', icon: '📈' },
        { id: 3, name: 'Lịch sử', icon: '🏛️' },
        { id: 4, name: 'Thiếu nhi', icon: '🧸' },
        { id: 5, name: 'Nghệ thuật', icon: '🎨' },
    ];

    const renderBookCard = (book: Book, tag?: string) => (
        <div key={book.id} className="book-card" onClick={() => navigate(`/books/${book.id}`)}>
            <div className="book-image-container">
                {(tag || book.discountPercent > 0) && (
                    <span className="book-tag">{tag || `-${book.discountPercent}%`}</span>
                )}
                <img src={book.imageUrl} alt={book.title} />
            </div>
            <div className="book-info">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">{book.authorName}</p>
                <div className="book-rating">
                    <span>★</span>
                    <span className="rating-number">{book.averageRating || 0}</span>
                </div>
                <div className="book-footer">
                    <span className="book-price">{formatPrice(book.price)}</span>
                    <button type="button" className="btn-cart">
                        <svg className="cart-icon-svg" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bookland-home-container">
            <Header />
            <main>
                {/* 1. HERO BANNER */}
                <section className="hero-banner">
                    <div className="max-width-content hero-grid" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div className="hero-left">
                            <span className="badge">Sách đặc biệt</span>
                            <h1>{featuredBooks[0]?.title || "Nghệ Thuật Sống Tối Giản"}</h1>
                            <p>{featuredBooks[0]?.description?.substring(0, 400)}...</p>
                            <div className="btn-group">
                                <button type="button" onClick={() => navigate(`/books/${featuredBooks[0]?.id}`)} className="btn-primary">Mua ngay</button>
                                <button type="button" onClick={() => navigate(`/books/${featuredBooks[0]?.id}`)} className="btn-outline">Xem chi tiết</button>
                            </div>
                        </div>
                        <div className="hero-right">
                            <div className="book-3d-wrapper">
                                <img src={featuredBooks[0]?.imageUrl || "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=300"} alt="Hero" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. DANH MỤC SÁCH */}
                <section className="categories-section max-width-content">
                    <div className="section-header"><h2>Danh mục sách</h2><span className="view-all-link">Xem tất cả →</span></div>
                    <div className="categories-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: '16px' }}>
                        {categories.map((cat) => (
                            <div key={cat.id} className="category-card">
                                <span className="category-icon">{cat.icon}</span>
                                <span className="category-name">{cat.name}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 3. SÁCH NỔI BẬT */}
                <section className="books-section max-width-content">
                    <div className="section-header"><h2>Sách nổi bật</h2><span className="view-all-link">Xem tất cả →</span></div>
                    <div className="books-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '24px' }}>
                        {featuredBooks.map(book => renderBookCard(book))}
                    </div>
                </section>

                {/* 4. SÁCH MỚI */}
                <section className="books-section max-width-content">
                    <div className="section-header"><h2>Sách mới</h2><span className="view-all-link">Xem tất cả →</span></div>
                    <div className="books-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '24px' }}>
                        {newBooks.map(book => renderBookCard(book, 'NEW'))}
                    </div>
                </section>

                {/* 5. SÁCH BÁN CHẠY */}
                <section className="books-section max-width-content">
                    <div className="section-header"><h2>Sách bán chạy</h2><span className="view-all-link">Xem tất cả →</span></div>
                    <div className="books-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '24px' }}>
                        {bestSellers.map(book => renderBookCard(book, 'BEST'))}
                    </div>
                </section>

                {/* 6. GỢI Ý CHO BẠN (Giữ nguyên Mock hoặc map từ danh sách bất kỳ) */}
                <section className="suggestions-section">
                    <div className="max-width-content">
                        <div className="section-header">
                            <div><h2>Gợi ý cho bạn</h2><p className="suggest-subtitle">Dựa trên sở thích của bạn</p></div>
                        </div>
                        <div className="suggestions-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '24px' }}>
                            {featuredBooks.slice(0, 3).map((item) => (
                                <div key={item.id} className="suggest-card" onClick={() => navigate(`/books/${item.id}`)}>
                                    <img src={item.imageUrl} alt={item.title} className="suggest-img" />
                                    <div className="suggest-info">
                                        <div><h4 className="suggest-title">{item.title}</h4><p className="suggest-author">{item.authorName}</p></div>
                                        <span className="suggest-price">{formatPrice(item.price)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}