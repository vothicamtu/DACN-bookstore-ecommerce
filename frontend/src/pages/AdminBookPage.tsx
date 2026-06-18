import React, { useState } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';

interface BookItem {
    id: number;
    title: string;
    author: string;
    category: string;
    price: number;
    stock: number;
    stockStatus: 'ỔN ĐỊNH' | 'SẮP HẾT';
    image: string;
}

const mockBooks: BookItem[] = [
    {
        id: 1,
        title: "The Alchemist's Legacy",
        author: "Eleanor Vance",
        category: "Cổ điển",
        price: 24.50,
        stock: 142,
        stockStatus: "ỔN ĐỊNH",
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=150&auto=format&fit=crop&q=60"
    },
    {
        id: 2,
        title: "The Midnight Librarian",
        author: "Julian Thorne",
        category: "Tiểu thuyết",
        price: 18.99,
        stock: 3,
        stockStatus: "SẮP HẾT",
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=150&auto=format&fit=crop&q=60"
    },
    {
        id: 3,
        title: "Mapping the Unseen",
        author: "GS. Arthur Penhaligon",
        category: "Lịch sử",
        price: 32.00,
        stock: 45,
        stockStatus: "ỔN ĐỊNH",
        image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=150&auto=format&fit=crop&q=60"
    }
];

const AdminBookPage: React.FC = () => {
    const [books] = useState<BookItem[]>(mockBooks);

    return (
        <div className="flex min-h-screen" style={{ backgroundColor: '#FDFBF7' }}>
            <AdminSidebar currentTab="books" />

            {/* Main Content */}
            <div className="flex-1 pl-64 p-10">
                <div className="font-semibold text-lg mb-6 tracking-wide" style={{ color: '#5C4033' }}>
                    The Literati Archive
                </div>

                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-1">Danh mục Sách</h1>
                        <p className="text-gray-500 text-sm">Quản lý kho hàng, mức tồn kho và siêu dữ liệu thư viện.</p>
                    </div>
                    <button className="bg-[#4E5B73] hover:bg-[#3D485C] text-white font-medium px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-sm transition-colors cursor-pointer">
                        + Thêm sách mới
                    </button>
                </div>

                {/* Filters */}
                <div className="flex gap-4 mb-6">
                    <div className="flex-1 relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tiêu đề, tác giả, hoặc ISBN..."
                            className="w-full pl-10 pr-4 py-3 border border-[#EAE2D5] rounded-xl text-sm focus:outline-none"
                            style={{ backgroundColor: '#FFFDF9' }}
                        />
                    </div>
                    <div className="w-52 relative">
                        <select className="w-full pl-4 pr-10 py-3 border border-[#EAE2D5] rounded-xl text-sm appearance-none text-gray-700 focus:outline-none cursor-pointer" style={{ backgroundColor: '#FFFDF9' }}>
                            <option>Tất cả danh mục</option>
                        </select>
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">▼</span>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white border border-[#EAE2D5] rounded-2xl overflow-hidden shadow-xs">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="text-xs font-bold uppercase border-b border-[#EAE2D5]" style={{ backgroundColor: '#F7F4EB', color: '#7F6D55' }}>
                            <th className="p-4 pl-6 w-[50%]">Thông tin sách</th>
                            <th className="p-4 w-[15%]">Giá</th>
                            <th className="p-4 w-[15%]">Tồn kho</th>
                            <th className="p-4 text-center w-[20%]">Thao tác</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F2ECE1]">
                        {books.map((book) => (
                            <tr key={book.id} className="hover:bg-[#FDFDFB]/50 transition-colors">
                                <td className="p-4 pl-6 flex items-center gap-4">
                                    <img src={book.image} alt={book.title} className="w-12 h-16 object-cover rounded shadow-xs" />
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-sm mb-1">{book.title}</h4>
                                        <div className="text-xs text-gray-500 flex items-center gap-2">
                                            {book.author} <span>•</span>
                                            <span className="px-2 py-0.5 rounded text-gray-700 font-medium text-[11px]" style={{ backgroundColor: '#F3ECE0' }}>{book.category}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 font-medium text-gray-700 text-sm">
                                    ${book.price.toFixed(2)}
                                </td>
                                <td className="p-4">
                                    <div className="font-bold text-gray-800 text-sm">{book.stock} đơn vị</div>
                                    <div className={`text-[10px] font-bold tracking-wider mt-0.5 ${book.stockStatus === 'SẮP HẾT' ? 'text-red-500' : 'text-gray-500'}`}>
                                        {book.stockStatus}
                                    </div>
                                </td>
                                <td className="p-4 text-center">
                                    <div className="flex justify-center gap-4 text-base">
                                        <button className="cursor-pointer hover:scale-110 transition-transform" title="Sửa">✏️</button>
                                        <button className="cursor-pointer hover:scale-110 transition-transform" title="Lưu kho">📦</button>
                                        <button className="cursor-pointer hover:scale-110 transition-transform" title="Xóa">🗑️</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center mt-6">
                    <p className="text-xs text-gray-500">Đang hiển thị {books.length} trên tổng số 1,248 đầu sách</p>
                    <div className="flex items-center gap-1.5">
                        <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 bg-white hover:bg-gray-50 text-xs text-gray-600 cursor-pointer">‹</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded text-white text-xs font-bold cursor-pointer" style={{ backgroundColor: '#5C4033' }}>1</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 bg-white hover:bg-gray-50 text-xs text-gray-600 cursor-pointer">2</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 bg-white hover:bg-gray-50 text-xs text-gray-600 cursor-pointer">3</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 bg-white hover:bg-gray-50 text-xs text-gray-600 cursor-pointer">›</button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminBookPage;