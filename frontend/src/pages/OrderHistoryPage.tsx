import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/OrderHistoryPage.css';

const OrderHistoryPage: React.FC = () => {
  return (
    <div className="order-page">
      <Header />

      <main className="order-page__main">
        <section className="order-hero">
          <h1 className="order-title">Lịch sử đơn hàng</h1>
          <p className="order-sub">Xem và quản lý tất cả các đơn đặt hàng từ trước đến nay của bạn.</p>
        </section>

        <section className="order-stats">
          <div className="stat-card">
            <div className="stat-label">TỔNG ĐƠN HÀNG</div>
            <div className="stat-value">24</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">ĐANG XỬ LÝ</div>
            <div className="stat-value">02</div>
          </div>
        </section>

        <section className="order-tableCard">
          <div className="table-header">Danh sách đơn hàng</div>
          <table className="order-table">
            <thead>
              <tr>
                <th>Mã đơn hàng</th>
                <th>Ngày đặt hàng</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#BL12345</td>
                <td>12 Tháng 10, 2023</td>
                <td>1.250.000đ</td>
                <td><span className="badge badge-success">ĐÃ GIAO</span></td>
                <td className="actions">
                  <button className="action-btn">Đánh giá</button>
                  <button className="action-btn secondary">Chi tiết</button>
                </td>
              </tr>
              <tr>
                <td>#BL12348</td>
                <td>25 Tháng 10, 2023</td>
                <td>450.000đ</td>
                <td><span className="badge badge-pending">ĐANG XỬ LÝ</span></td>
                <td className="actions">
                  <button className="action-btn">Đánh giá</button>
                  <button className="action-btn secondary">Chi tiết</button>
                </td>
              </tr>
              <tr>
                <td>#BL12352</td>
                <td>02 Tháng 11, 2023</td>
                <td>890.000đ</td>
                <td><span className="badge badge-success">ĐÃ GIAO</span></td>
                <td className="actions">
                  <button className="action-btn">Đánh giá</button>
                  <button className="action-btn secondary">Chi tiết</button>
                </td>
              </tr>
              <tr>
                <td>#BL12359</td>
                <td>15 Tháng 11, 2023</td>
                <td>2.100.000đ</td>
                <td><span className="badge badge-cancel">ĐÃ HỦY</span></td>
                <td className="actions">
                  <button className="action-btn">Đánh giá</button>
                  <button className="action-btn secondary">Chi tiết</button>
                </td>
              </tr>
              <tr>
                <td>#BL12401</td>
                <td>20 Tháng 11, 2023</td>
                <td>320.000đ</td>
                <td><span className="badge badge-success">ĐÃ GIAO</span></td>
                <td className="actions">
                  <button className="action-btn">Đánh giá</button>
                  <button className="action-btn secondary">Chi tiết</button>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="order-tableFooter">
            <div className="table-note">Hiển thị 1-5 của 24 đơn hàng</div>
            <div className="pagination">
              <button className="page-btn">&lt;</button>
              <button className="page-btn is-active">1</button>
              <button className="page-btn">2</button>
              <button className="page-btn">3</button>
              <button className="page-btn">&gt;</button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default OrderHistoryPage;
