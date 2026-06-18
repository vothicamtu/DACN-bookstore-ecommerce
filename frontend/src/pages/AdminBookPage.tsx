import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';

interface BookItem {
    id: number;
    title: string;
    imageUrl: string | null;
    price: number;
    stock: number;
    author: { id: number; authorName: string } | null;
    category: { id: number; categoryName: string } | null;
}

interface BookFormState {
    id?: number;
    title: string;
    imageUrl: string;
    price: number;
    stock: number;
    authorId: string;
    categoryId: string;
}

const AdminBookPage: React.FC = () => {
    const [books, setBooks] = useState<BookItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const [formState, setFormState] = useState<BookFormState>({
        title: '',
        imageUrl: '',
        price: 0,
        stock: 0,
        authorId: '1',
        categoryId: '1'
    });

    const fetchBooks = () => {
        fetch('http://localhost:8080/api/books')
            .then((res) => {
                if (!res.ok) throw new Error("Không thể kết nối đến API");
                return res.json();
            })
            .then((result) => {
                if (result && result.data && Array.isArray(result.data.content)) {
                    setBooks(result.data.content);
                } else if (Array.isArray(result)) {
                    setBooks(result);
                } else {
                    setBooks([]);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Lỗi lấy dữ liệu:", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleDelete = (id: number) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa cuốn sách này khỏi thư viện?")) {
            fetch(`http://localhost:8080/api/books/${id}`, {
                method: 'DELETE',
            })
                .then((res) => {
                    if (res.ok) {
                        alert("Xóa sách thành công!");
                        fetchBooks();
                    } else {
                        alert("Xóa thất bại. Kiểm tra cấu hình CORS/Quyền hạn ở Backend!");
                    }
                })
                .catch(err => console.error("Lỗi xóa sách:", err));
        }
    };

    const openAddModal = () => {
        setFormState({ title: '', imageUrl: '', price: 0, stock: 0, authorId: '1', categoryId: '1' });
        setIsModalOpen(true);
    };

    const openEditModal = (book: BookItem) => {
        setFormState({
            id: book.id,
            title: book.title,
            imageUrl: book.imageUrl || '',
            price: book.price,
            stock: book.stock,
            authorId: book.author?.id ? String(book.author.id) : '1',
            categoryId: book.category?.id ? String(book.category.id) : '1'
        });
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        // Chuẩn hóa dữ liệu gửi đi khớp với DTO nhận diện thông thường của Spring Boot
        const payload = {
            id: formState.id || null,
            title: formState.title,
            imageUrl: formState.imageUrl || null,
            price: formState.price,
            stock: formState.stock,
            authorId: Number(formState.authorId),
            categoryId: Number(formState.categoryId),
            author: { id: Number(formState.authorId) },
            category: { id: Number(formState.categoryId) }
        };

        const isEdit = !!formState.id;
        const method = isEdit ? 'PUT' : 'POST';

        // CẢI TIẾN: Nếu Backend báo lỗi đường dẫn /id, bạn hãy đổi thử url thành 'http://localhost:8080/api/books' cho cả 2 trường hợp nhé!
        const url = isEdit ? `http://localhost:8080/api/books/${formState.id}` : 'http://localhost:8080/api/books';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert(isEdit ? "Cập nhật thông tin sách thành công!" : "Thêm sách mới thành công!");
                setIsModalOpen(false);
                fetchBooks();
            } else {
                const errRes = await response.json().catch(() => null);
                alert(`Lỗi hệ thống (${response.status}): ${errRes?.message || 'Yêu cầu dữ liệu bị từ chối!'}`);
            }
        } catch (err) {
            console.error("Lỗi kết nối:", err);
            alert("Không thể gửi yêu cầu lưu dữ liệu! Hãy kiểm tra Annotation @CrossOrigin tại Backend.");
        }
    };

    const getStockStatus = (stock: number) => {
        return stock <= 5
            ? { text: 'SẮP HẾT', color: 'text-red-500 bg-red-50' }
            : { text: 'ỔN ĐỊNH', color: 'text-green-600 bg-green-50' };
    };

    return (
        <div className="flex min-h-screen bg-[#FDFBF7]">
            <AdminSidebar currentTab="books" />

            <div className="flex-1 pl-64 p-10">
                <div className="font-semibold text-lg mb-6 tracking-wide text-[#5C4033]">
                    The Literati Archive
                </div>

                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-1">Danh mục Sách</h1>
                        <p className="text-gray-500 text-sm">Quản lý kho hàng, mức tồn kho và siêu dữ liệu thư viện.</p>
                    </div>
                    <button onClick={openAddModal} className="bg-[#4E5B73] hover:bg-[#3D485C] text-white font-medium px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-sm transition-colors cursor-pointer">
                        + Thêm sách mới
                    </button>
                </div>

                <div className="flex gap-4 mb-6">
                    <div className="flex-1 relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                        <input type="text" placeholder="Tìm kiếm theo tiêu đề, tác giả..." className="w-full pl-10 pr-4 py-3 border border-[#EAE2D5] rounded-xl text-sm focus:outline-none bg-[#FFFDF9]" />
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-10 font-medium text-gray-500">Đang kết nối thư viện dữ liệu...</div>
                ) : (
                    <div className="bg-white border border-[#EAE2D5] rounded-2xl overflow-hidden shadow-xs">
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="text-xs font-bold uppercase border-b border-[#EAE2D5] bg-[#F7F4EB] text-[#7F6D55]">
                                <th className="p-4 pl-6 w-[50%]">Thông tin sách</th>
                                <th className="p-4 w-[15%]">Giá</th>
                                <th className="p-4 w-[15%]">Tồn kho</th>
                                <th className="p-4 text-center w-[20%]">Thao tác</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F2ECE1]">
                            {books && books.length > 0 ? (
                                books.map((book) => {
                                    const status = getStockStatus(book.stock || 0);
                                    return (
                                        <tr key={book.id} className="hover:bg-[#FDFDFB]/50 transition-colors">
                                            <td className="p-4 pl-6 flex items-center gap-4">
                                                <img
                                                    src={book.imageUrl || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=150&auto=format&fit=crop&q=60"}
                                                    alt={book.title}
                                                    className="w-12 h-16 object-cover rounded shadow-xs"
                                                    onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=150&auto=format&fit=crop&q=60"; }}
                                                />
                                                <div>
                                                    <h4 className="font-bold text-gray-800 text-sm mb-1">{book.title || "Không rõ tiêu đề"}</h4>
                                                    <div className="text-xs text-gray-500 flex items-center gap-2">
                                                        {book.author?.authorName || "Chưa rõ tác giả"} <span>•</span>
                                                        <span className="px-2 py-0.5 rounded text-gray-700 font-medium text-[11px] bg-[#F3ECE0]">
                                                            {book.category?.categoryName || "Chưa phân loại"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 font-medium text-gray-700 text-sm">
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book.price || 0)}
                                            </td>
                                            <td className="p-4">
                                                <div className="font-bold text-gray-800 text-sm">{book.stock || 0} đơn vị</div>
                                                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded tracking-wider mt-1 ${status.color}`}>
                                                    {status.text}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center">
                                                <div className="flex justify-center gap-4 text-base">
                                                    <button onClick={() => openEditModal(book)} className="cursor-pointer hover:scale-110 transition-transform" title="Sửa">✏️</button>
                                                    <button onClick={() => handleDelete(book.id)} className="cursor-pointer hover:scale-110 transition-transform" title="Xóa">🗑️</button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={4} className="text-center py-12 text-gray-400 text-sm font-medium">
                                        📭 Thư viện trống hoặc kết nối dữ liệu bị ngắt.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* MODAL FORM */}
                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs z-50">
                        <div className="bg-white rounded-2xl w-full max-w-lg p-6 border border-[#EAE2D5] shadow-xl">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">{formState.id ? 'Cập nhật thông tin Sách' : 'Thêm Sách mới vào thư viện'}</h2>
                            <form onSubmit={handleSave} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Tiêu đề sách</label>
                                    <input type="text" required value={formState.title} onChange={(e) => setFormState({...formState, title: e.target.value})} className="w-full px-3 py-2 border border-[#EAE2D5] rounded-xl text-sm focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Đường dẫn ảnh (URL)</label>
                                    <input type="text" value={formState.imageUrl} onChange={(e) => setFormState({...formState, imageUrl: e.target.value})} className="w-full px-3 py-2 border border-[#EAE2D5] rounded-xl text-sm focus:outline-none" placeholder="https://images.unsplash.com/..." />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Giá bán (VND)</label>
                                        <input type="number" required min={0} value={formState.price} onChange={(e) => setFormState({...formState, price: Number(e.target.value)})} className="w-full px-3 py-2 border border-[#EAE2D5] rounded-xl text-sm focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Số lượng kho</label>
                                        <input type="number" required min={0} value={formState.stock} onChange={(e) => setFormState({...formState, stock: Number(e.target.value)})} className="w-full px-3 py-2 border border-[#EAE2D5] rounded-xl text-sm focus:outline-none" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Tác giả</label>
                                        <select value={formState.authorId} onChange={(e) => setFormState({...formState, authorId: e.target.value})} className="w-full px-3 py-2 border border-[#EAE2D5] rounded-xl text-sm focus:outline-none bg-white">
                                            <option value="1">Nguyễn Nhật Ánh</option>
                                            <option value="2">Dale Carnegie</option>
                                            <option value="3">Robert Kiyosaki</option>
                                            <option value="4">J.K. Rowling</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Danh mục</label>
                                        <select value={formState.categoryId} onChange={(e) => setFormState({...formState, categoryId: e.target.value})} className="w-full px-3 py-2 border border-[#EAE2D5] rounded-xl text-sm focus:outline-none bg-white">
                                            <option value="1">Văn học</option>
                                            <option value="2">Kinh tế</option>
                                            <option value="3">Kỹ năng</option>
                                            <option value="4">Thiếu nhi</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 pt-2 border-t border-[#F2ECE1]">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 rounded-xl cursor-pointer">Hủy bỏ</button>
                                    <button type="submit" className="px-5 py-2 text-sm font-medium text-white bg-[#4E5B73] hover:bg-[#3D485C] rounded-xl shadow-xs cursor-pointer">Lưu lại</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="flex justify-between items-center mt-6">
                    <p className="text-xs text-gray-500">Đang hiển thị {books.length} đầu sách trên hệ thống</p>
                    <div className="flex items-center gap-1.5">
                        <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 bg-white text-xs text-gray-600 cursor-pointer">‹</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded text-white text-xs font-bold cursor-pointer bg-[#5C4033]">1</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 bg-white text-xs text-gray-600 cursor-pointer">›</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminBookPage;