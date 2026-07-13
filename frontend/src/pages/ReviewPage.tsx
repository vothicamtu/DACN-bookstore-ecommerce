import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/ReviewPage.css';

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

type ReviewItem = {
  orderId: number;
  orderStatus: string;
  orderItemId: number;
  bookId: number;
  title: string;
  imageUrl?: string | null;
  authorName?: string | null;
  categoryName?: string | null;
  quantity: number;
  price: number;
  reviewed: boolean;
  existingRating?: number | null;
  existingComment?: string | null;
};

const ReviewPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [comments, setComments] = useState<Record<number, string>>({});
  const [submitMessages, setSubmitMessages] = useState<Record<number, string>>({});
  const [submittingId, setSubmittingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!orderId) {
      setError('Không tìm thấy mã đơn hàng.');
      setLoading(false);
      return;
    }

    setLoading(true);
    axiosClient
      .get<ApiResponse<ReviewItem[]>>(`/orders/${orderId}/review-items`)
      .then((response) => {
        const data: ReviewItem[] = response.data.data ?? [];
        setItems(data);
        setError('');
      })
      .catch(() => {
        setError('Không lấy được sản phẩm trong đơn hàng.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [orderId]);

  function setItemRating(orderItemId: number, rating: number) {
    setRatings((current) => ({
      ...current,
      [orderItemId]: rating,
    }));
    setSubmitMessages((current) => ({
      ...current,
      [orderItemId]: '',
    }));
  }

  function setItemComment(orderItemId: number, comment: string) {
    setComments((current) => ({
      ...current,
      [orderItemId]: comment,
    }));
  }

  function submitReview(item: ReviewItem) {
    const rating = ratings[item.orderItemId] ?? 0;

    if (rating < 1) {
      setSubmitMessages((current) => ({
        ...current,
        [item.orderItemId]: 'Vui lòng chọn số sao trước khi gửi.',
      }));
      return;
    }

    setSubmittingId(item.orderItemId);
    axiosClient
      .post('/reviews', {
        orderItemId: item.orderItemId,
        rating,
        comment: comments[item.orderItemId] ?? '',
      })
      .then(() => {
        setItems((prev) => prev.map((i) =>
          i.orderItemId === item.orderItemId
            ? { ...i, reviewed: true, existingRating: ratings[item.orderItemId], existingComment: comments[item.orderItemId] ?? '' }
            : i
        ));
      })
      .catch((err) => {
        setSubmitMessages((current) => ({
          ...current,
          [item.orderItemId]: err.response?.data?.message || 'Không gửi được đánh giá.',
        }));
      })
      .finally(() => {
        setSubmittingId(null);
      });
  }

  return (
    <div className="review-page">
      <Header />

      <main className="review-main">
        <nav className="crumbs">
          <Link to="/">Trang chủ</Link>
          &nbsp; &gt; &nbsp;
          <Link to="/orders">Đơn hàng của tôi</Link>
          &nbsp; &gt; &nbsp;
          Viết đánh giá
        </nav>

        <section className="review-card">
          <header className="review-card__head">
            <h1>Đánh giá sản phẩm</h1>
          </header>

          {loading ? (
            <div className="review-state">Đang tải sản phẩm trong đơn hàng...</div>
          ) : error ? (
            <div className="review-state review-state--error">{error}</div>
          ) : items.length === 0 ? (
            <div className="review-state">Đơn hàng này chưa có sản phẩm để đánh giá.</div>
          ) : (
            <div className="review-items">
              {items.map((item) => {
                const isReviewed = item.reviewed;
                return (
                <div className={`review-item${isReviewed ? ' is-reviewed' : ''}`} key={item.orderItemId}>
                  <div className="product-row">
                    <img
                      src={item.imageUrl || '/src/assets/placeholder-book.png'}
                      alt={item.title}
                      className="product-thumb"
                    />
                    <div className="product-info">
                      <div className="product-cat">{item.categoryName || 'Chưa phân loại'}</div>
                      <h2 className="product-title">{item.title}</h2>
                      <div className="product-author">Tác giả: {item.authorName || 'Đang cập nhật'}</div>
                      <div className="product-bought">Đã mua tại BookLand • Số lượng: {item.quantity}</div>
                    </div>
                  </div>

                  <hr />

                  {isReviewed ? (
                    <div className="reviewed-summary">
                      <div className="stars reviewed-stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className={`star ${star <= (item.existingRating ?? 0) ? 'is-active' : ''}`}>
                            <Star size={24} fill={star <= (item.existingRating ?? 0) ? 'currentColor' : 'none'} />
                          </span>
                        ))}
                      </div>
                      {item.existingComment && (
                        <p className="reviewed-comment">{item.existingComment}</p>
                      )}
                    </div>
                  ) : (
                    <>
                  <div className="rating-row">
                    <label className="rating-label">Bạn đánh giá cuốn sách này thế nào?</label>
                    <div className="stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className={`star ${star <= (ratings[item.orderItemId] ?? 0) ? 'is-active' : ''}`}
                          onClick={() => setItemRating(item.orderItemId, star)}
                        >
                          <Star size={24} fill={star <= (ratings[item.orderItemId] ?? 0) ? 'currentColor' : 'none'} />
                        </button>
                      ))}
                    </div>
                    <div className="hint">Hãy chọn số sao tương ứng với trải nghiệm của bạn.</div>
                  </div>

                  <div className="field">
                    <label>Chia sẻ cảm nhận của bạn</label>
                    <textarea
                      placeholder="Hãy chia sẻ điều gì đó về nội dung, phong cách hành văn, hoặc cảm xúc mà cuốn sách mang lại cho bạn..."
                      value={comments[item.orderItemId] ?? ''}
                      onChange={(event) => setItemComment(item.orderItemId, event.target.value)}
                    />
                  </div>

                  <div className="form-footer">
                    <label className="anon"><input type="checkbox" /> Đăng đánh giá ẩn danh</label>
                    <button
                      className="submit-btn"
                      type="button"
                      disabled={submittingId === item.orderItemId}
                      onClick={() => submitReview(item)}
                    >
                      {submittingId === item.orderItemId ? 'Đang gửi...' : 'Gửi đánh giá'}
                    </button>
                  </div>
                  {submitMessages[item.orderItemId] ? (
                    <div className="review-submitMessage">{submitMessages[item.orderItemId]}</div>
                  ) : null}
                    </>
                  )}
                </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ReviewPage;
