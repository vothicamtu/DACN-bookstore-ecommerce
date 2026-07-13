import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axiosClient from "../api/axiosClient";

import Header from "../components/Header";
import Footer from "../components/Footer";
import FilterSidebar from "../components/FilterSidebar";
import BookCard from "../components/BookCard";
import Pagination from "../components/Pagination";
import { addToCart, getCartErrorMessage, hasAuthToken, isAuthError } from "../services/cartService";
import "../styles/ProductAllPage.css";

interface Book {

    id: number;

    title: string;

    imageUrl: string;

    authorName: string;

    price: number;
}

interface Category {

    id: number;

    categoryName: string;
}

export default function SearchPage() {
    const navigate = useNavigate();
    const [books, setBooks] = useState<Book[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [keyword, setKeyword] = useState("");
    const [categoryId, setCategoryId] = useState<any>("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [addingCartId, setAddingCartId] = useState<number | null>(null);
    const [cartMessage, setCartMessage] = useState("");
    const [cartErrorMessage, setCartErrorMessage] = useState("");
    const [cartErrorBookId, setCartErrorBookId] = useState<number | null>(null);
    const [loginPromptOpen, setLoginPromptOpen] = useState(false);
    const headerCategories = categories.map((category) => ({
        label: category.categoryName,
        value: category.categoryName,
    }));

    const fetchBooks = async (pageNumber: number = page) => {
        setLoading(true);
        setError("");

        try {
            const response = await axiosClient.get("/books/search", {
                params: {
                    keyword: keyword || null,
                    categoryId: categoryId || null,
                    minPrice: minPrice || null,
                    maxPrice: maxPrice || null,
                    page: pageNumber,
                    size: 8,
                },
            });
            setBooks(response.data.data.content);
            setTotalPages(response.data.data.totalPages);
        } catch (error) {
            console.error(error);
            setError("Không lấy được danh sách sách phù hợp.");
        } finally {
            setLoading(false);
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
        setCategoryId(id);
        setPage(0);
    };

    const goToBooks = (params: Record<string, string> = {}) => {
        const nextParams = new URLSearchParams(params);
        const search = nextParams.toString();
        navigate({
            pathname: "/books",
            search: search ? `?${search}` : "",
        });
    };

    const handleAddToCart = async (bookId: number) => {
        if (!hasAuthToken()) {
            setCartMessage("");
            setCartErrorMessage("Vui lòng đăng nhập để thêm vào giỏ hàng.");
            setCartErrorBookId(bookId);
            setLoginPromptOpen(true);
            return;
        }

        setAddingCartId(bookId);
        setCartMessage("");
        setCartErrorMessage("");
        setCartErrorBookId(null);

        try {
            await addToCart(bookId, 1);
            setCartMessage("Đã thêm sản phẩm vào giỏ hàng.");
        } catch (error) {
            setCartErrorBookId(bookId);

            if (isAuthError(error)) {
                setCartErrorMessage("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
                setLoginPromptOpen(true);
            } else {
                setCartErrorMessage(getCartErrorMessage(error, "Không thể thêm sản phẩm vào giỏ hàng."));
            }
        } finally {
            setAddingCartId(null);
        }
    };

    useEffect(() => {
        fetchBooks(page);
    }, [page, categoryId]);

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div className="min-h-screen bg-[#F7F2E7]">

            <Header
                keyword={keyword}
                setKeyword={setKeyword}
                onSearch={handleSearch}
                activeNav="store"
                categories={headerCategories}
                onStoreClick={() => goToBooks()}
                onCategorySelect={(category) => goToBooks({ category })}
                onBestSellerClick={() => goToBooks({ sort: "bestseller" })}
                onNewestClick={() => goToBooks({ sort: "newest" })}
            />

            <main className="bookland-page__main">
                <div className="bookland-breadcrumb">
                    Trang chủ / Tìm kiếm
                </div>

                <section className="bookland-layout">
                    <FilterSidebar
                        categories={categories}
                        categoryId={categoryId}
                        setCategoryId={handleCategoryChange}
                        minPrice={minPrice}
                        setMinPrice={setMinPrice}
                        maxPrice={maxPrice}
                        setMaxPrice={setMaxPrice}
                        onSearch={handleSearch}
                    />

                    <div className="bookland-content">
                    <div className="bookland-searchPageHeader">
                        <div>
                            <h1>Kết quả tìm kiếm</h1>
                            <p>Hiển thị {books.length} đầu sách phù hợp</p>
                        </div>
                    </div>

                    {cartMessage ? (
                        <div className="bookland-cartMessage">
                            {cartMessage}
                        </div>
                    ) : null}

                    {loading ? (
                        <div className="bookland-state">Đang tải sách...</div>
                    ) : error ? (
                        <div className="bookland-state bookland-state--error">{error}</div>
                    ) : books.length === 0 ? (
                        <div className="bookland-state">Không có sách phù hợp.</div>
                    ) : (
                        <div className="bookland-searchGrid">

                            {books.map((book) => (

                                <BookCard
                                    key={book.id}
                                    book={book}
                                    adding={addingCartId === book.id}
                                    addToCartError={
                                        cartErrorBookId === book.id
                                            ? cartErrorMessage || "Không thể thêm sản phẩm vào giỏ hàng."
                                            : ""
                                    }
                                    onAddToCart={handleAddToCart}
                                />
                            ))}
                        </div>
                    )}

                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        setPage={setPage}
                    />
                    </div>
                </section>
            </main>

            <Footer />

            {loginPromptOpen ? (
                <div className="bookland-loginPrompt" role="dialog" aria-modal="true" aria-labelledby="searchLoginPromptTitle">
                    <div className="bookland-loginPrompt__panel">
                        <h2 id="searchLoginPromptTitle">
                            Cần đăng nhập
                        </h2>
                        <p>
                            Bạn cần đăng nhập trước khi thêm sách vào giỏ hàng.
                        </p>
                        <div className="bookland-loginPrompt__actions">
                            <button
                                type="button"
                                onClick={() => setLoginPromptOpen(false)}
                            >
                                Đóng
                            </button>
                            <a
                                href="/login"
                            >
                                Đăng nhập
                            </a>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
