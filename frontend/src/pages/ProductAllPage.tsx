import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/ProductAllPage.css';
import { useEffect, useState } from 'react';

type Product = {
	id: number;
	category: string;
	title: string;
	author: string;
	imageUrl?: string;
	price: string;
	oldPrice?: string;
	rating: string;
	accent: string;
};

type ApiProduct = {
	id: number;
	title: string;
	imageUrl?: string | null;
	price: number;
	discountPercent?: number | null;
	averageRating?: number | null;
	categoryName?: string | null;
	authorName?: string | null;
};

type ApiProductPage = {
	items: ApiProduct[];
	page: number;
	size: number;
	totalPages: number;
	totalItems: number;
};

const categoryFilters = ['Tất cả', 'Văn học', 'Kinh tế', 'Kỹ năng', 'Thiếu nhi', 'Giáo khoa'];
const PRODUCTS_PER_PAGE = 9;

const sortOptions = [
	{ label: 'Bán chạy nhất', value: 'popular' },
	{ label: 'Mới nhất', value: 'newest' },
	{ label: 'Giá tăng dần', value: 'priceAsc' },
	{ label: 'Giá giảm dần', value: 'priceDesc' },
];

const coverAccents = [
	'book-cover--blue',
	'book-cover--sand',
	'book-cover--light',
	'book-cover--graphite',
	'book-cover--brown',
	'book-cover--gray',
];

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
	style: 'currency',
	currency: 'VND',
	maximumFractionDigits: 0,
});

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

function resolveImageUrl(imageUrl?: string | null) {
	if (!imageUrl) {
		return undefined;
	}

	if (/^(https?:)?\/\//.test(imageUrl) || imageUrl.startsWith('data:')) {
		return imageUrl;
	}

	const normalizedPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
	return `${API_BASE_URL}${normalizedPath}`;
}

function mapProduct(product: ApiProduct, index: number): Product {
	const discountPercent = product.discountPercent ?? 0;
	const oldPrice = discountPercent > 0
		? product.price / (1 - discountPercent / 100)
		: undefined;

	return {
		id: product.id,
		category: product.categoryName ?? 'Chưa phân loại',
		title: product.title,
		author: product.authorName ?? 'Đang cập nhật',
		imageUrl: resolveImageUrl(product.imageUrl),
		price: currencyFormatter.format(product.price),
		oldPrice: oldPrice ? currencyFormatter.format(oldPrice) : undefined,
		rating: (product.averageRating ?? 0).toFixed(1),
		accent: coverAccents[index % coverAccents.length],
	};
}

export default function ProductAllPage() {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('Tất cả');
	const [minPrice, setMinPrice] = useState('');
	const [maxPrice, setMaxPrice] = useState('');
	const [minRating, setMinRating] = useState(0);
	const [sort, setSort] = useState('popular');
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);
	const [totalItems, setTotalItems] = useState(0);

	useEffect(() => {
		const controller = new AbortController();
		const params = new URLSearchParams();

		if (selectedCategory !== 'Tất cả') {
			params.set('category', selectedCategory);
		}

		if (minPrice) {
			params.set('minPrice', minPrice);
		}

		if (maxPrice) {
			params.set('maxPrice', maxPrice);
		}

		if (minRating > 0) {
			params.set('minRating', String(minRating));
		}

		params.set('sort', sort);
		params.set('page', String(currentPage - 1));
		params.set('size', String(PRODUCTS_PER_PAGE));
		setLoading(true);

		fetch(`${API_BASE_URL}/api/products?${params.toString()}`, { signal: controller.signal })
			.then((response) => {
				if (!response.ok) {
					throw new Error('Không lấy được danh sách sản phẩm');
				}

				return response.json() as Promise<ApiProductPage>;
			})
			.then((data) => {
				setProducts(data.items.map(mapProduct));
				setTotalPages(data.totalPages);
				setTotalItems(data.totalItems);
				setError('');
			})
			.catch((err: Error) => {
				if (err.name !== 'AbortError') {
					setError(err.message);
				}
			})
			.finally(() => {
				setLoading(false);
			});

		return () => controller.abort();
	}, [selectedCategory, minPrice, maxPrice, minRating, sort, currentPage]);

	function resetFilters() {
		setSelectedCategory('Tất cả');
		setMinPrice('');
		setMaxPrice('');
		setMinRating(0);
		setSort('popular');
		setCurrentPage(1);
	}

	function getVisiblePages() {
		return Array.from({ length: totalPages }, (_, index) => index + 1);
	}

	function selectCategory(category: string) {
		setSelectedCategory(category);
		setCurrentPage(1);

		if (category === 'Tất cả') {
			setMinPrice('');
			setMaxPrice('');
			setMinRating(0);
		}
	}

	return (
		<div className="bookland-page">
			<Header />

			<main className="bookland-page__main">
				<div className="bookland-breadcrumb">Sách mới / Xem thêm</div>

				<section className="bookland-layout">
					<aside className="bookland-filters">
						<div className="bookland-filterPanel">
							<div className="bookland-filterGroup">
								<h2>DANH MỤC</h2>
								<div className="bookland-chipList">
									{categoryFilters.map((item) => (
										<button
											key={item}
											type="button"
											className={`bookland-chip ${selectedCategory === item ? 'is-active' : ''}`}
											onClick={() => selectCategory(item)}
										>
											{item}
										</button>
									))}
								</div>
							</div>

							<div className="bookland-filterGroup">
								<h2>KHOẢNG GIÁ</h2>
								<div className="bookland-priceRange">
									<label>
										<span>Từ</span>
										<input
											type="number"
											min="0"
											step="10000"
											value={minPrice}
											onChange={(event) => {
												setMinPrice(event.target.value);
												setCurrentPage(1);
											}}
										/>
									</label>
									<label>
										<span>Đến</span>
										<input
											type="number"
											min="0"
											step="10000"
											value={maxPrice}
											onChange={(event) => {
												setMaxPrice(event.target.value);
												setCurrentPage(1);
											}}
										/>
									</label>
								</div>
							</div>

							<div className="bookland-filterGroup">
								<h2>ĐÁNH GIÁ</h2>
								<div className="bookland-ratingList">
									<label className="bookland-ratingRow">
										<input
											type="checkbox"
											checked={minRating === 4}
											onChange={(event) => {
												setMinRating(event.target.checked ? 4 : 0);
												setCurrentPage(1);
											}}
										/>
										<span className="bookland-ratingStars">★★★★★</span>
										<span>Từ 4 sao</span>
									</label>
									<label className="bookland-ratingRow">
										<input
											type="checkbox"
											checked={minRating === 3}
											onChange={(event) => {
												setMinRating(event.target.checked ? 3 : 0);
												setCurrentPage(1);
											}}
										/>
										<span className="bookland-ratingStars">★★★★★</span>
										<span>Từ 3 sao</span>
									</label>
								</div>
							</div>

							<div className="bookland-filterGroup">
								<h2>SẮP XẾP</h2>
								<select
									className="bookland-sortSelect"
									value={sort}
									onChange={(event) => {
										setSort(event.target.value);
										setCurrentPage(1);
									}}
								>
									{sortOptions.map((option) => (
										<option key={option.value} value={option.value}>
											{option.label}
										</option>
									))}
								</select>
							</div>

							<button type="button" className="bookland-filterReset" onClick={resetFilters}>
								Xóa bộ lọc
							</button>
						</div>
					</aside>

					<div className="bookland-content">
						<div className="bookland-resultSummary">
							{totalItems > 0 ? `Hiển thị ${products.length} / ${totalItems} sản phẩm` : 'Không có sản phẩm phù hợp'}
						</div>

						{loading ? (
							<div className="bookland-state">Đang tải sản phẩm...</div>
						) : error ? (
							<div className="bookland-state bookland-state--error">{error}</div>
						) : products.length === 0 ? (
							<div className="bookland-state">Không có sản phẩm.</div>
						) : (
							<div className="bookland-grid">
								{products.map((product) => (
									<article key={product.id} className="bookland-card">
										<div className={`bookland-card__cover ${product.accent}`}>
											{product.imageUrl ? (
												<img
													src={product.imageUrl}
													alt={product.title}
													className="bookland-card__image"
													loading="lazy"
													onError={(event) => {
														event.currentTarget.hidden = true;
													}}
												/>
											) : null}
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
						)}

						{totalPages > 1 ? (
							<div className="bookland-pagination" aria-label="Phân trang">
								<button
									type="button"
									disabled={currentPage === 1}
									onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
								>
									{'<'}
								</button>
								{getVisiblePages().map((page) => (
									<button
										key={page}
										type="button"
										className={currentPage === page ? 'is-active' : ''}
										onClick={() => setCurrentPage(page)}
									>
										{page}
									</button>
								))}
								<button
									type="button"
									disabled={currentPage === totalPages}
									onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
								>
									{'>'}
								</button>
							</div>
						) : null}
					</div>
				</section>
			</main>

			<Footer />
		</div>
	);
}
