import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home(): React.JSX.Element {
    const navigate = useNavigate();

    return (
        <div className="bookland-page">
            <Header />
            <main className="bookland-homePlaceholder">
                <span>BOOKLAND</span>
                <h1>Không gian dành cho người yêu sách</h1>
                <p>Khám phá những đầu sách được tuyển chọn dành riêng cho bạn.</p>
                <button type="button" onClick={() => navigate('/books')}>
                    Khám phá cửa hàng
                </button>
            </main>
            <Footer />
        </div>
    );
}
