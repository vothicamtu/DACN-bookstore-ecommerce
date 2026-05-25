import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/ProductAllPage.css';

type FilterGroup = {
	title: string;
	items: string[];
};

type Product = {
	category: string;
	title: string;
	author: string;
	price: string;
	oldPrice?: string;
	rating: string;
	accent: string;
};

const filterGroups: FilterGroup[] = [
	{
		title: 'Danh mục',
		items: ['Văn học trẻ', 'Tâm lý - Kỹ năng', 'Kinh tế', 'Lịch sử', 'Khoa học', 'Tiểu thuyết'],
	},
	{
		title: 'Khoảng giá',
		items: ['50.000đ', '300.000đ'],
	},
];

const products: Product[] = [
	{
		category: 'Kinh tế',
		title: 'Tư Duy Nhanh Và Chậm',
		author: 'Daniel Kahneman',
		price: '245.000đ',
		oldPrice: '320.000đ',
		rating: '4.9',
		accent: 'book-cover--blue',
	},
	{
		category: 'Văn học',
		title: 'Nhà Giả Kim',
		author: 'Paulo Coelho',
		price: '89.000đ',
		rating: '4.8',
		accent: 'book-cover--sand',
	},
	{
		category: 'Nghệ thuật',
		title: 'Thiết Kế Đồ Họa Căn Bản',
		author: 'Ellen Lupton',
		price: '156.000đ',
		oldPrice: '195.000đ',
		rating: '5.0',
		accent: 'book-cover--light',
	},
	{
		category: 'Kỹ năng',
		title: 'Atomic Habits - Thay Đổi Tí Hon',
		author: 'James Clear',
		price: '189.000đ',
		rating: '4.7',
		accent: 'book-cover--graphite',
	},
	{
		category: 'Lịch sử',
		title: 'Sapiens - Lược Sử Loài Người',
		author: 'Yuval Noah Harari',
		price: '212.000đ',
		oldPrice: '265.000đ',
		rating: '4.9',
		accent: 'book-cover--brown',
	},
	{
		category: 'Trinh thám',
		title: 'Án Mạng Trên Chuyến Tàu Tốc Hành',
		author: 'Agatha Christie',
		price: '115.000đ',
		rating: '4.6',
		accent: 'book-cover--gray',
	},
];

export default function ProductAllPage() {
	return (
		<div className="bookland-page">
			<Header />

			<main className="bookland-page__main">
				<div className="bookland-breadcrumb">Sách mới / Xem thêm</div>

				<section className="bookland-layout">
					<aside className="bookland-filters">
						<div className="bookland-filterPanel">
							<div className="bookland-filterGroup">
								<h2>{filterGroups[0].title.toUpperCase()}</h2>
								<div className="bookland-chipList">
									{filterGroups[0].items.map((item, index) => (
										<button
											key={item}
											type="button"
											className={`bookland-chip ${index === 0 ? 'is-active' : ''}`}
										>
											{item}
										</button>
									))}
								</div>
							</div>

							<div className="bookland-filterGroup">
								<h2>{filterGroups[1].title.toUpperCase()}</h2>
								<div className="bookland-priceRange">
									<div className="bookland-priceRange__track">
										<span className="bookland-priceRange__fill" />
										<span className="bookland-priceRange__thumb bookland-priceRange__thumb--left" />
										<span className="bookland-priceRange__thumb bookland-priceRange__thumb--right" />
									</div>
									<div className="bookland-priceRange__labels">
										<span>{filterGroups[1].items[0]}</span>
										<span>{filterGroups[1].items[1]}</span>
									</div>
								</div>
							</div>

							<div className="bookland-filterGroup">
								<h2>ĐÁNH GIÁ</h2>
								<div className="bookland-ratingList">
									<label className="bookland-ratingRow">
										<input type="checkbox" defaultChecked />
										<span className="bookland-ratingStars">★★★★★</span>
										<span>Từ 4 sao</span>
									</label>
									<label className="bookland-ratingRow">
										<input type="checkbox" />
										<span className="bookland-ratingStars">★★★★★</span>
										<span>Từ 3 sao</span>
									</label>
								</div>
							</div>

							<div className="bookland-filterGroup">
								<h2>SẮP XẾP</h2>
								<select className="bookland-sortSelect" defaultValue="Bán chạy nhất">
									<option>Bán chạy nhất</option>
									<option>Mới nhất</option>
									<option>Giá tăng dần</option>
									<option>Giá giảm dần</option>
								</select>
							</div>

							<button type="button" className="bookland-filterReset">
								Xóa bộ lọc
							</button>
						</div>
					</aside>

					<div className="bookland-content">
						<div className="bookland-grid">
							{products.map((product) => (
								<article key={product.title} className="bookland-card">
									<div className={`bookland-card__cover ${product.accent}`}>
										<div className="bookland-card__coverGlow" />
										<div className="bookland-card__coverLabel">BookLand</div>
									</div>

									<div className="bookland-card__body">
										<div className="bookland-card__meta">
											<span>{product.category}</span>
											<span>★ {product.rating}</span>
										</div>
										<h3>{product.title}</h3>
										<p>{product.author}</p>
										<div className="bookland-card__priceRow">
											<span className="bookland-card__price">{product.price}</span>
											{product.oldPrice ? <span className="bookland-card__oldPrice">{product.oldPrice}</span> : null}
										</div>
									</div>
								</article>
							))}
						</div>

						<div className="bookland-pagination" aria-label="Phân trang">
							<button type="button" className="is-active">1</button>
							<button type="button">2</button>
							<button type="button">3</button>
							<span>...</span>
							<button type="button">12</button>
						</div>
					</div>
				</section>
			</main>

			<Footer />
		</div>
	);
}
