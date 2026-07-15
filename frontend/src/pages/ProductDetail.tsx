import React, {useState, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import bookApi, { Book } from '../api/bookApi';
import '../styles/productdetail.css';

export default function ProductDetail(): React.JSX.Element {
    const navigate = useNavigate();
    const {id} = useParams<{ id: string }>();
    const [book, setBook] = useState<Book | null>(null);
    const [relatedBooks, setRelatedBooks] = useState<Book[]>([]);
    const [quantity, setQuantity] = useState<number>(1);
    const [selectedImage, setSelectedImage] = useState<number>(0);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    useEffect(() => {
        const fetchDetail = async () => {
            if (!id) return;
            try {
                const res = await bookApi.getById(id);
                if (res.data.success) setBook(res.data.data);

                const relRes = await bookApi.getAll({ size: 4 }); // Lấy tạm 4 cuốn làm sách tương tự
                if (relRes.data.success) setRelatedBooks(relRes.data.data.content);
            } catch (e) { console.error(e); }
        };
        fetchDetail();
        window.scrollTo(0, 0);
    }, [id]);

    // Mock data cho Reviews vì chưa có API Review
    const reviews = [
        { id: 1, user: 'Minh Tuấn', date: '12/05/2024', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100', rating: 5, content: 'Cuốn sách thật sự cảm động. Một tác phẩm đáng đọc.' },
        { id: 2, user: 'Phương Linh', date: '09/05/2024', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100', rating: 4, content: 'Giao hàng nhanh, nội dung rất ý nghĩa.' }
    ];

    if (!book) return <div>Đang tải...</div>;

    const subImages = [book.imageUrl, book.imageUrl, book.imageUrl]; // Dùng tạm ảnh chính cho gallery

    return (
        <div className="bookland-detail-container">
            <Header/>
            <main className="max-width-content">
                <nav className="breadcrumb">
                    <span onClick={() => navigate('/')}>Trang chủ</span> &gt; <span>{book.categoryName}</span> &gt; <span className="active">{book.title}</span>
                </nav>

                <section className="product-main-section" style={{display: 'flex', gap: '48px', marginBottom: '40px'}}>
                    <div className="product-gallery" style={{display: 'flex', flexDirection: 'column', width: '40%'}}>
                        <div className="main-image-wrapper">
                            <img src={subImages[selectedImage]} alt={book.title} className="main-product-img"/>
                        </div>
                        <div className="sub-images-list" style={{display: 'flex', gap: '12px', marginTop: '16px'}}>
                            {subImages.map((img, idx) => (
                                <div key={idx} className={`sub-img-item ${selectedImage === idx ? 'active' : ''}`} onClick={() => setSelectedImage(idx)}>
                                    <img src={img} alt="sub"/>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="product-actions-info" style={{display: 'flex', flexDirection: 'column', width: '60%'}}>
                        {book.discountPercent > 0 && <span className="detail-bestseller-tag">GIẢM {book.discountPercent}%</span>}
                        <h1 className="detail-product-title">{book.title}</h1>
                        <div className="detail-meta-row" style={{display: 'flex', gap: '24px', margin: '12px 0'}}>
                            <span>Tác giả: <strong className="accent-text">{book.authorName}</strong></span>
                            <span>Nhà xuất bản: <strong className="accent-text">{book.publisherName}</strong></span>
                        </div>
                        <div className="detail-rating-row" style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px'}}>
                            <div className="stars-orange">{'★'.repeat(Math.round(book.averageRating || 0))}</div>
                            <span className="review-count">({book.averageRating}/5)</span>
                        </div>
                        <div className="detail-price-box" style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px'}}>
                            <span className="detail-current-price">{formatPrice(book.price)}</span>
                        </div>
                        <p className="stock-status-text">Còn {book.stock} quyển trong kho</p>

                        <div className="quantity-selector-wrapper" style={{display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0'}}>
                            <div className="quantity-counter">
                                <button onClick={() => quantity > 1 && setQuantity(quantity-1)}>-</button>
                                <input type="number" value={quantity} readOnly/>
                                <button onClick={() => setQuantity(quantity+1)}>+</button>
                            </div>
                        </div>
                        <div className="detail-btn-group" style={{display: 'flex', gap: '16px'}}>
                            <button className="btn-buy-now">Mua ngay</button>
                            <button className="btn-add-cart">Thêm vào giỏ</button>
                        </div>
                    </div>
                </section>

                {/* TABS SECTION */}
                <section className="product-tabs-section" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '48px' }}>
                    <div className="tab-content-card">
                        <div className="tab-card-header">Mô tả sản phẩm</div>
                        <div className="tab-card-body"><p>{book.description}</p></div>
                    </div>
                    <div className="tab-content-card">
                        <div className="tab-card-header">Thông tin chi tiết</div>
                        <div className="tab-card-body spec-table-body">
                            <div className="spec-row" style={{display: 'flex', justifyContent: 'space-between'}}><span>Dịch giả</span><span>{book.translator}</span></div>
                            <div className="spec-row" style={{display: 'flex', justifyContent: 'space-between'}}><span>Kích thước</span><span>{book.size}</span></div>
                            <div className="spec-row" style={{display: 'flex', justifyContent: 'space-between'}}><span>Số trang</span><span>{book.pageCount}</span></div>
                            <div className="spec-row" style={{display: 'flex', justifyContent: 'space-between'}}><span>Ngày phát hành</span><span>{book.publishDate}</span></div>
                        </div>
                    </div>
                </section>

                {/* REVIEWS SECTION */}
                <section className="reviews-section" style={{marginBottom: '48px'}}>
                    <div className="section-header-flex" style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
                        <div><h2 className="section-title-main">Đánh giá từ độc giả</h2></div>
                        <button className="btn-write-review">✏ Viết đánh giá</button>
                    </div>
                    <div className="reviews-grid" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px'}}>
                        {reviews.map(rev => (
                            <div key={rev.id} className="review-item-card" style={{display: 'flex', gap: '16px'}}>
                                <img src={rev.avatar} alt="user" className="review-avatar"/>
                                <div style={{flex: 1}}>
                                    <div style={{display: 'flex', justifyContent: 'space-between'}}><h4>{rev.user}</h4><span>{'★'.repeat(rev.rating)}</span></div>
                                    <p>{rev.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* RELATED BOOKS */}
                <section className="books-section-detail">
                    <h2 className="section-title-main">Sách tương tự</h2>
                    <div className="books-grid-detail" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                        {relatedBooks.map(item => (
                            <div key={item.id} className="book-card-detail" onClick={() => navigate(`/books/${item.id}`)}>
                                <img src={item.imageUrl} alt={item.title} />
                                <h3>{item.title}</h3>
                                <p>{formatPrice(item.price)}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
            <Footer/>
        </div>
    );
}