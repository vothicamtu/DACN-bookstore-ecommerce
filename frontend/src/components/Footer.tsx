import '../styles/bookland.css';

const quickLinks = ['Về chúng tôi', 'Sách mới', 'Khuyến mãi', 'Thành viên'];
const supportLinks = ['Chính sách bảo mật', 'Điều khoản dịch vụ', 'Liên hệ'];

export default function Footer() {
  return (
    <footer className="bookland-footer">
      <div className="bookland-footer__inner">
        <div className="bookland-footer__brandBlock">
          <div className="bookland-footer__logo">BookLand</div>
          <p>
            Atelier của tri thức, nơi mỗi cuốn sách là một tác phẩm nghệ thuật cần được nâng niu.
          </p>
        </div>

        <div className="bookland-footer__column">
          <h3>Liên kết nhanh</h3>
          {quickLinks.map((link) => (
            <a key={link} href="#">
              {link}
            </a>
          ))}
        </div>

        <div className="bookland-footer__column">
          <h3>Hỗ trợ khách hàng</h3>
          {supportLinks.map((link) => (
            <a key={link} href="#">
              {link}
            </a>
          ))}
        </div>

        <div className="bookland-footer__column">
          <h3>Thông tin liên hệ</h3>
          <p>123 Đường Văn Học, Hà Nội</p>
          <p>0123 456 789</p>
          <p>hello@bookland.vn</p>
        </div>
      </div>

      <div className="bookland-footer__bottom">© 2024 BookLand. Atelier của tri thức.</div>
    </footer>
  );
}