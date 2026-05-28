import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/ProductAllPage.css';

interface Book {
	id: number;
	title: string;
	imageUrl: string;
	description: string;
	price: number;
	discountPercent: number;
	stock: number;
	translator: string;
	pageCount: number;
	size: string;
	publishDate: string;
	averageRating: number;
	categoryName: string;
	authorName: string;
	publisherName: string;
}

interface Category {
	id: number;
	categoryName: string;
	description: string;
}

const getAccentClass = (id: number) => {
	const accents = [
		'book-cover--blue',
		'book-cover--sand',
		'book-cover--light',
		'book-cover--graphite',
		'book-cover--brown',
		'book-cover--gray'
	];
	return accents[id % accents.length];
};

export default function ProductAllPage() {
	const [books, setBooks] = useState<Book[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [keyword, setKeyword] = useState("");
	const [categoryId, setCategoryId] = useState<any>("");
	const [minPrice, setMinPrice] = useState("");
	const [maxPrice, setMaxPrice] = useState("");
	const [page, setPage] = useState(0);
	const [totalPages, setTotalPages] = useState(0);

	const fetchBooks = async (pageNumber: number = page) => {
		try {
			const response = await axiosClient.get("/books/search", {
				params: {
					keyword: keyword || null,
					categoryId: categoryId || null,
					minPrice: minPrice || null,
					maxPrice: maxPrice || null,
					page: pageNumber,
					size: 6,
				},
			});
			setBooks(response.data.data.content);
			setTotalPages(response.data.data.totalPages);
		} catch (error) {
			console.error(error);
		}
	};

	const fetchCategories = async () => {
		try {
			const response = await axiosClient.get("/categories");
			setCategories(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	const handleSearch = () => {
		if (page === 0) {
			fetchBooks(0);
		} else {
			setPage(0);
		}
	};

	const handleCategoryChange = (id: any) => {
		setCategoryId(categoryId === id ? "" : id);
		setPage(0);
	};

	useEffect(() => {
		fetchBooks(page);
	}, [page, categoryId]);

	useEffect(() => {
		fetchCategories();
	}, []);

	return (
		<div className="bookland-page">
			<Header
				keyword={keyword}
				setKeyword={setKeyword}
				onSearch={handleSearch}
			/>

			<main className="bookland-page__main">
				<div className="bookland-breadcrumb">Sách mới / Xem thêm</div>

				<section className="bookland-layout">
					<aside className="bookland-filters">
						<div className="bookland-filterPanel">
							<div className="bookland-filterGroup">
								<h2>DANH MỤC</h2>
								<div className="bookland-chipList">
									{categories.map((category) => (
										<button
											key={category.id}
											type="button"
											onClick={() => handleCategoryChange(category.id)}
											className={`bookland-chip ${categoryId === category.id ? 'is-active' : ''}`}
										>
											{category.categoryName}
										</button>
									))}
								</div>
							</div>

							<div className="bookland-filterGroup" style={{ marginBottom: '24px' }}>
								<h2 style={{ fontSize: '0.82rem', fontWeight: '800', letterSpacing: '0.08em', color: '#8d6b2f', marginBottom: '14px' }}>KHOẢNG GIÁ</h2>
								<div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
									<input
										type="number"
										placeholder="Từ (đ)"
										value={minPrice}
										onChange={(e) => setMinPrice(e.target.value)}
										style={{
											border: '1px solid #eadfca',
											borderRadius: '12px',
											padding: '12px 16px',
											background: '#fff',
											width: '100%',
											outline: 'none',
											fontFamily: 'inherit',
											fontSize: '0.95rem',
											color: '#302416'
										}}
									/>
									<input
										type="number"
										placeholder="Đến (đ)"
										value={maxPrice}
										onChange={(e) => setMaxPrice(e.target.value)}
										style={{
											border: '1px solid #eadfca',
											borderRadius: '12px',
											padding: '12px 16px',
											background: '#fff',
											width: '100%',
											outline: 'none',
											fontFamily: 'inherit',
											fontSize: '0.95rem',
											color: '#302416'
										}}
									/>
								</div>
							</div>

							<div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '28px' }}>
								<button
									type="button"
									onClick={handleSearch}
									style={{
										background: '#8c5a1e',
										color: '#fff',
										border: 'none',
										borderRadius: '12px',
										padding: '14px',
										fontWeight: '600',
										fontSize: '0.95rem',
										cursor: 'pointer',
										width: '100%',
										transition: 'background 0.2s',
										boxShadow: '0 4px 12px rgba(140, 90, 30, 0.15)'
									}}
									onMouseOver={(e) => e.currentTarget.style.background = '#734614'}
									onMouseOut={(e) => e.currentTarget.style.background = '#8c5a1e'}
								>
									Áp dụng bộ lọc
								</button>

								<button
									type="button"
									onClick={() => {
										setCategoryId("");
										setMinPrice("");
										setMaxPrice("");
										setKeyword("");
										setPage(0);
									}}
									style={{
										background: 'transparent',
										color: '#8c5a1e',
										border: '2px solid #8c5a1e',
										borderRadius: '12px',
										padding: '12px',
										fontWeight: '600',
										fontSize: '0.95rem',
										cursor: 'pointer',
										width: '100%',
										transition: 'all 0.2s'
									}}
									onMouseOver={(e) => {
										e.currentTarget.style.background = 'rgba(140, 90, 30, 0.05)';
									}}
									onMouseOut={(e) => {
										e.currentTarget.style.background = 'transparent';
									}}
								>
									Xóa bộ lọc
								</button>
							</div>
						</div>
					</aside>

					<div className="bookland-content">
						{books.length === 0 ? (
							<div className="text-center py-10 text-[#7f6a55]">
								Không tìm thấy sách nào phù hợp.
							</div>
						) : (
							<div className="bookland-grid">
								{books.map((book) => (
									<article key={book.id} className="bookland-card">
										<div className={`bookland-card__cover ${getAccentClass(book.id)}`} style={{ position: 'relative', overflow: 'hidden' }}>
											<div className="bookland-card__coverGlow" style={{ zIndex: 2 }} />
											{book.imageUrl ? (
												<img
													src={book.imageUrl}
													alt={book.title}
													style={{
														position: 'absolute',
														top: 0,
														left: 0,
														width: '100%',
														height: '100%',
														objectFit: 'cover',
														zIndex: 1,
														opacity: 0.95
													}}
												/>
											) : null}
											<div className="bookland-card__coverLabel z-10" style={{ zIndex: 3 }}>BookLand</div>
										</div>

										<div className="bookland-card__body">
											<div className="bookland-card__meta">
												<span>{book.categoryName || 'Sách'}</span>
												<span>★ {book.averageRating || '5.0'}</span>
											</div>
											<h3 className="line-clamp-2 min-h-[48px]">{book.title}</h3>
											<p className="truncate">{book.authorName || 'Chưa rõ tác giả'}</p>
											<div className="bookland-card__priceRow">
												<span className="bookland-card__price">{Number(book.price).toLocaleString()}đ</span>
												{book.discountPercent ? (
													<span className="bookland-card__oldPrice">
														{Number(book.price * (1 + book.discountPercent / 100)).toLocaleString()}đ
													</span>
												) : null}
											</div>
										</div>
									</article>
								))}
							</div>
						)}

						{totalPages > 1 && (
							<div className="bookland-pagination" aria-label="Phân trang">
								{Array.from({ length: totalPages }).map((_, index) => (
									<button
										key={index}
										type="button"
										onClick={() => setPage(index)}
										className={page === index ? "is-active" : ""}
										style={{ cursor: 'pointer' }}
									>
										{index + 1}
									</button>
								))}
							</div>
						)}
					</div>
				</section>
			</main>

			<Footer />
		</div>
	);
}
