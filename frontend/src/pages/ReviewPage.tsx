import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/ReviewPage.css';

const ReviewPage: React.FC = () => {
  return (
    <div className="review-page">
      <Header />

      <main className="review-main">
        <nav className="crumbs">Trang chủ &nbsp; &gt; &nbsp; Đơn hàng của tôi &nbsp; &gt; &nbsp; Viết đánh giá</nav>

        <section className="review-card">
          <header className="review-card__head">
            <h1>Đánh giá sản phẩm</h1>
          </header>

          <div className="product-row">
            <img src="/src/assets/placeholder-book.png" alt="cover" className="product-thumb" />
            <div className="product-info">
              <div className="product-cat">Văn học đương đại</div>
              <h2 className="product-title">Nghệ Thuật Của Sự Tĩnh Lặng</h2>
              <div className="product-author">Tác giả: Elena Richardson</div>
              <div className="product-bought">Đã mua tại BookLand</div>
            </div>
          </div>

          <hr />

          <div className="rating-row">
            <label className="rating-label">Bạn đánh giá cuốn sách này thế nào?</label>
            <div className="stars">
              <button className="star">☆</button>
              <button className="star">☆</button>
              <button className="star">☆</button>
              <button className="star">☆</button>
              <button className="star">☆</button>
            </div>
            <div className="hint">Hãy chọn số sao tương ứng với trải nghiệm của bạn.</div>
          </div>

          <div className="field">
            <label>Chia sẻ cảm nhận của bạn</label>
            <textarea placeholder="Hãy chia sẻ điều gì đó về nội dung, phong cách hành văn, hoặc cảm xúc mà cuốn sách mang lại cho bạn..."></textarea>
          </div>

          <div className="images-row">
            <label>Thêm hình ảnh thực tế</label>
            <div className="images-inputs">
              <div className="upload-placeholder">Tải ảnh lên</div>
              <img src="/src/assets/placeholder-book.png" alt="sample" className="sample-img" />
            </div>
            <div className="images-hint">Định dạng JPG, PNG. Tối đa 5MB mỗi ảnh.</div>
          </div>

          <div className="form-footer">
            <label className="anon"><input type="checkbox" /> Đăng đánh giá ẩn danh</label>
            <button className="submit-btn">Gửi đánh giá</button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ReviewPage;
