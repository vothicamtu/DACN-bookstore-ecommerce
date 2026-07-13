import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/TermsPrivacyPage.css";

export default function TermsPrivacyPage() {
  return (
    <div className="legal-page">
      <Header />
      <main className="legal-page__main">
        <header className="legal-page__hero">
          <span>BOOKLAND</span>
          <h1>Điều khoản sử dụng &amp; Chính sách bảo mật</h1>
          <p>Cập nhật lần cuối: 22/06/2026</p>
        </header>
        <nav className="legal-page__nav">
          <a href="#terms">Điều khoản sử dụng</a>
          <a href="#privacy">Chính sách bảo mật</a>
          <a href="#contact">Liên hệ</a>
        </nav>
        <div className="legal-page__content">
          <section id="terms">
            <span>01</span>
            <div>
              <h2>Điều khoản sử dụng</h2>
              <h3>Phạm vi áp dụng</h3>
              <p>Các điều khoản này áp dụng khi bạn truy cập BookLand, tạo tài khoản, thêm sản phẩm vào giỏ hàng hoặc mua sách.</p>
              <h3>Tài khoản người dùng</h3>
              <p>Bạn có trách nhiệm cung cấp thông tin chính xác, bảo vệ thông tin đăng nhập và chịu trách nhiệm với hoạt động từ tài khoản của mình.</p>
              <h3>Đặt hàng và thanh toán</h3>
              <p>Đơn hàng được xác nhận sau khi hệ thống ghi nhận thành công. Giá và phí vận chuyển được hiển thị trước khi hoàn tất đơn hàng.</p>
              <h3>Hủy đơn và hoàn trả</h3>
              <p>Yêu cầu hủy hoặc đổi trả được xử lý theo trạng thái đơn hàng và chính sách hỗ trợ hiện hành của BookLand.</p>
            </div>
          </section>
          <section id="privacy">
            <span>02</span>
            <div>
              <h2>Chính sách bảo mật</h2>
              <h3>Thông tin được thu thập</h3>
              <p>BookLand thu thập thông tin cần thiết như họ tên, email, số điện thoại và địa chỉ để xử lý tài khoản và đơn hàng.</p>
              <h3>Mục đích sử dụng</h3>
              <p>Thông tin được dùng để xác thực, giao hàng, hỗ trợ khách hàng, cải thiện dịch vụ và đáp ứng nghĩa vụ pháp lý.</p>
              <h3>Bảo vệ dữ liệu</h3>
              <p>Mật khẩu được mã hóa trước khi lưu. BookLand áp dụng biện pháp hợp lý để hạn chế truy cập hoặc tiết lộ dữ liệu trái phép.</p>
              <h3>Quyền của người dùng</h3>
              <p>Bạn có thể yêu cầu xem hoặc cập nhật thông tin cá nhân bằng cách liên hệ bộ phận hỗ trợ BookLand.</p>
            </div>
          </section>
          <section id="contact">
            <span>03</span>
            <div>
              <h2>Thông tin liên hệ</h2>
              <p>Email: lienhe@bookland.vn</p>
              <p>Điện thoại: 0123 456 789</p>
              <p>Địa chỉ: 123 Đường Sách, Quận 1, TP. Hồ Chí Minh</p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
