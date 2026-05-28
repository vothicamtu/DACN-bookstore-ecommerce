import { useEffect, useState } from "react";

import axiosClient from "../api/axiosClient";

import Header from "../components/Header";
import Footer from "../components/Footer";
import FilterSidebar from "../components/FilterSidebar";
import BookCard from "../components/BookCard";
import Pagination from "../components/Pagination";

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
                    size: 8,
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
        setCategoryId(id);
        setPage(0);
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
            />

            <div className="max-w-[1450px] mx-auto px-6 py-10 flex gap-10">

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

                <main className="flex-1">

                    <div className="text-sm text-[#7B6A4A] mb-4">
                        Trang chủ &gt; Tìm kiếm
                    </div>

                    <h1 className="text-5xl font-bold mb-3">
                        Kết quả tìm kiếm
                    </h1>

                    <p className="text-[#7B6A4A] mb-10">
                        Hiển thị {books.length} đầu sách phù hợp
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                        {books.map((book) => (

                            <BookCard
                                key={book.id}
                                book={book}
                            />
                        ))}
                    </div>

                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        setPage={setPage}
                    />
                </main>
            </div>

            <Footer />
        </div>
    );
}