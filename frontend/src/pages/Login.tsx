import React, { FormEvent, useState } from 'react';
import { Facebook } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/auth.css';

export default function Login(): React.JSX.Element {
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usernameOrEmail, password })
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify({
                    id: data.userId,
                    fullName: data.fullName,
                    username: data.username,
                    email: data.email,
                    role: data.role,
                }));
                navigate('/books');
            } else {
                alert(data.message || 'Đăng nhập thất bại');
            }
        } catch (error) {
            alert('Lỗi: Không thể kết nối đến máy chủ hệ thống!');
        }
    };

    return (
        <div className="auth-page">
            <Header />

            {/* MAIN CONTENT */}
            <main className="auth-main">

                {/* Banner Left */}
                <div className="auth-banner">
                    <div className="auth-banner__img-wrap">
                        <img
                            src="/src/assets/auth.png"
                            alt="BookLand Illustration"
                            className="auth-banner__img"
                        />
                    </div>
                    <div className="auth-banner__content">
                        <h1 className="auth-banner__title">Chào mừng quay trở lại</h1>
                        <p className="auth-banner__desc">
                            Đăng nhập để tiếp tục khám phá những cuốn sách phù hợp với bạn
                        </p>
                    </div>
                </div>

                {/* Form Right */}
                <div className="auth-form-side">
                    <div className="auth-card--bordered">
                        <h2 className="auth-card__title">Đăng nhập</h2>
                        <p className="auth-card__subtitle">Tiếp tục hành trình đọc sách cùng BookLand</p>

                        <form className="auth-form" onSubmit={handleSubmit}>
                            <div className="auth-form__group">
                                <label className="auth-form__label">Username hoặc email</label>
                                <input
                                    type="text"
                                    placeholder="Nhập username hoặc email"
                                    className="auth-form__input"
                                    value={usernameOrEmail}
                                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="auth-form__group">
                                <label className="auth-form__label">Mật khẩu</label>
                                <input
                                    type="password"
                                    placeholder="Nhập mật khẩu"
                                    className="auth-form__input"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="auth-form__actions">
                                <div className="auth-form__checkbox-wrap">
                                    <input
                                        type="checkbox"
                                        id="remember"
                                        className="auth-form__checkbox"
                                    />
                                    <label htmlFor="remember" className="auth-form__checkbox-label">Ghi nhớ đăng nhập</label>
                                </div>
                                <a href="#" className="auth-form__link">Quên mật khẩu?</a>
                            </div>

                            <button
                                type="submit"
                                className="auth-form__submit-btn"
                            >
                                Đăng nhập
                            </button>
                        </form>

                        <div className="auth-divider">
                            <div className="auth-divider__line"></div>
                            <span className="auth-divider__text">Hoặc</span>
                            <div className="auth-divider__line"></div>
                        </div>

                        {/*<div className="auth-social">
                            <button type="button" className="auth-social__btn">
                                <svg className="w-4 h-4" viewBox="0 0 24 24">
                                    <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.107C18.332 2.114 15.54 1 12.24 1c-6.075 0-11 4.925-11 11s4.925 11 11 11c6.34 0 10.556-4.445 10.556-10.74 0-.726-.077-1.282-.175-1.785H12.24z"/>
                                </svg>
                                <span>Google</span>
                            </button>
                            <button type="button" className="auth-social__btn auth-social__btn--facebook">
                                <Facebook className="w-4 h-4 fill-current" />
                                <span>Facebook</span>
                            </button>
                        </div>*/}

                        <div className="auth-switch-mode">
                            <span className="auth-switch-mode__text">Chưa có tài khoản? </span>
                            <Link to="/register" className="auth-form__link" style={{ fontWeight: 500 }}>Đăng ký ngay</Link>
                        </div>

                    </div>
                </div>
            </main>

            {/* FOOTER */}
            <footer className="auth-footer">
                <div className="auth-footer__grid">
                    <div>
                        <h3 className="auth-footer__brand">BookLand</h3>
                        <p className="auth-footer__text" style={{ lineHeight: '1.625', maxWidth: '280px' }}>
                            Nơi lan tỏa tri thức và cảm hứng thông qua những trang sách được tuyển chọn kỹ lưỡng.
                        </p>
                        <div className="auth-footer__contacts">
                            <p>📍 123 Đường Sách, Quận 1, TP. Hồ Chí Minh</p>
                            <p>📞 0123 456 789</p>
                            <p>✉️ lienhe@bookland.vn</p>
                        </div>
                    </div>
                    <div>
                        <h3 className="auth-footer__title">Khám phá</h3>
                        <ul className="auth-footer__list">
                            <li><a href="#" className="auth-footer__link">Về chúng tôi</a></li>
                            <li><a href="#" className="auth-footer__link">Chính sách vận chuyển</a></li>
                            <li><a href="#" className="auth-footer__link">Điều khoản dịch vụ</a></li>
                            <li><a href="#" className="auth-footer__link">Liên hệ</a></li>
                            <li><a href="#" className="auth-footer__link">Câu hỏi thường gặp</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="auth-footer__title">Kết nối</h3>
                        <p className="auth-footer__text" style={{ marginBottom: '16px' }}>Theo dõi chúng tôi trên các mạng xã hội để cập nhật tin tức mới nhất.</p>
                        <div className="auth-footer__social-wrap">
                            <a href="#" className="auth-footer__link"><Facebook className="auth-footer__social-icon" /></a>
                            <a href="#" className="auth-footer__link">
                                <svg className="auth-footer__social-icon" style={{ fill: 'currentColor' }} viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
