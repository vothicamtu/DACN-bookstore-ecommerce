import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../components/admin/AdminSidebar';

interface CategoryItem {
    id: number;
    categoryName: string;
    description: string;
}

interface CategoryFormState {
    id?: number;
    categoryName: string;
    description: string;
}

const AdminCategoryPage: React.FC = () => {
    const [categories, setCategories] = useState<CategoryItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [totalElements, setTotalElements] = useState<number>(0);

    const [formState, setFormState] = useState<CategoryFormState>({
        categoryName: '',
        description: ''
    });

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };
    };

    const fetchCategories = async () => {
        setLoading(true);
        try {
            // Tạm thời lấy size lớn để hiển thị dạng list cuộn như thiết kế
            const response = await axios.get(`http://localhost:8080/api/categories?page=0&size=50`, getAuthHeaders());
            const result = response.data;
            if (result && result.success && result.data) {
                setCategories(result.data.content || []);
                setTotalElements(result.data.totalElements || 0);
            }
        } catch (err) {
            console.error("Lỗi lấy dữ liệu danh mục:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const isEdit = !!formState.id;
        const url = isEdit
            ? `http://localhost:8080/api/categories/${formState.id}`
            : 'http://localhost:8080/api/categories';

        try {
            if (isEdit) {
                await axios.put(url, formState, getAuthHeaders());
            } else {
                await axios.post(url, formState, getAuthHeaders());
            }
            setIsModalOpen(false);
            fetchCategories();
        } catch (err) {
            console.error(err);
            alert("Lỗi khi lưu dữ liệu!");
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Bạn có chắc muốn xóa danh mục này?")) {
            try {
                await axios.delete(`http://localhost:8080/api/categories/${id}`, getAuthHeaders());
                fetchCategories();
            } catch (err) {
                console.error(err);
                alert("Không thể xóa danh mục đang có sách!");
            }
        }
    };

    const openModal = (category?: CategoryItem) => {
        if (category) {
            setFormState({ id: category.id, categoryName: category.categoryName, description: category.description || '' });
        } else {
            setFormState({ categoryName: '', description: '' });
        }
        setIsModalOpen(true);
    };

    return (
        <div className="flex min-h-screen bg-[#FDFBF6] font-sans text-[#3D322A]">
            {/* Sidebar (Sử dụng component bạn đã có) */}
            <AdminSidebar currentTab="categories" />

            {/* Main Content */}
            <div className="flex-1 pl-64 flex flex-col">
                {/* Header Navbar */}
                <header className="flex justify-between items-center px-10 py-5 border-b border-[#F2EBE1] bg-[#FDFBF6]">
                    <div className="font-bold text-lg text-[#5A4533] tracking-wide">The Literati Archive</div>
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                            <input
                                type="text"
                                placeholder="Tìm kiếm danh mục..."
                                className="bg-[#F3EFE6] border-none rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#CDBEAA] w-64 text-[#5A4533]"
                            />
                        </div>
                        <button className="relative text-gray-500 hover:text-gray-700">
                            🔔<span className="absolute -top-1 -right-1 bg-red-500 w-2.5 h-2.5 rounded-full border-2 border-[#FDFBF6]"></span>
                        </button>
                        <div className="w-8 h-8 rounded-full bg-[#E5D5C5] text-[#5A4533] flex items-center justify-center font-bold">
                            A
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-10 flex-1 overflow-y-auto">
                    {/* Tiêu đề & Nút thêm */}
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h1 className="text-2xl font-semibold text-[#3D322A] mb-1">Quản lý Danh mục</h1>
                            <p className="text-gray-500 text-sm">Tổ chức và quản lý hệ thống phân loại tri thức cho thư viện của bạn.</p>
                        </div>
                        <button
                            onClick={() => openModal()}
                            className="bg-[#6B4F3B] hover:bg-[#533C2C] text-white font-medium px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-colors cursor-pointer text-sm"
                        >
                            <span className="text-lg">+</span> Thêm danh mục
                        </button>
                    </div>

                    {/* Thống kê (2 Blocks) */}
                    <div className="grid grid-cols-2 gap-6 mb-8">
                        <div className="bg-[#FAF3E0] rounded-2xl p-6 border border-[#F2EBE1]">
                            <p className="text-xs font-bold text-gray-500 tracking-wider mb-2 uppercase">Tổng số danh mục</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold text-[#6B4F3B]">{totalElements}</span>
                                <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">+2 tháng này</span>
                            </div>
                        </div>
                        <div className="bg-[#EAEFFD] rounded-2xl p-6 border border-[#E0E6F6] relative overflow-hidden">
                            <p className="text-xs font-bold text-[#5C6E9E] tracking-wider mb-2 uppercase">Phổ biến nhất</p>
                            <h3 className="text-lg font-medium text-[#2E3C66]">Văn học hư cấu <span className="text-sm text-[#5C6E9E] font-normal">(1.240 cuốn sách)</span></h3>
                            <div className="absolute top-6 right-6 w-10 h-10 bg-white/50 rounded-xl flex items-center justify-center text-[#5C6E9E]">
                                📈
                            </div>
                        </div>
                    </div>

                    {/* Bảng danh sách */}
                    <div className="bg-white rounded-2xl border border-[#F2EBE1] shadow-sm mb-8">
                        <table className="w-full text-left">
                            <thead>
                            <tr className="border-b border-[#F2EBE1] text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                <th className="py-4 px-6 w-[60%]">Tên danh mục</th>
                                <th className="py-4 px-6 text-center w-[20%]">Số lượng sách</th>
                                <th className="py-4 px-6 text-right w-[20%]">Thao tác</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F2EBE1]">
                            {loading ? (
                                <tr><td colSpan={3} className="text-center py-10 text-gray-400">Đang tải...</td></tr>
                            ) : categories.map((cat) => (
                                <tr key={cat.id} className="hover:bg-[#FDFCFB] transition-colors group">
                                    <td className="py-4 px-6 flex items-start gap-4">
                                        <span className="text-gray-300 mt-1 cursor-grab">⣿</span>
                                        <div>
                                            <h4 className="font-medium text-[#3D322A] text-sm">{cat.categoryName}</h4>
                                            <p className="text-xs text-gray-500 mt-0.5 truncate max-w-md">{cat.description || 'Không có mô tả'}</p>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                            <span className="bg-[#F9F4E5] text-[#8C6D41] text-xs font-semibold px-3 py-1 rounded-full">
                                                {/* Giả lập số lượng sách vì DB gốc của bạn chưa trả về field này ở API Category */}
                                                {Math.floor(Math.random() * 500) + 100}
                                            </span>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openModal(cat)} className="p-1.5 text-gray-500 hover:text-[#6B4F3B] hover:bg-[#F3EFE6] rounded-md cursor-pointer">
                                                ✏️
                                            </button>
                                            <button onClick={() => handleDelete(cat.id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md cursor-pointer">
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Block Mở rộng kho lưu trữ */}
                    <div className="border-2 border-dashed border-[#E5DFD4] rounded-2xl p-10 flex flex-col items-center text-center bg-[#FDFBF6]/50">
                        <div className="w-12 h-12 bg-[#F3EFE6] rounded-full flex items-center justify-center text-xl mb-4 text-[#8C6D41]">
                            ✨
                        </div>
                        <h3 className="font-medium text-[#3D322A] mb-2">Mở rộng kho lưu trữ</h3>
                        <p className="text-sm text-gray-500 max-w-md mb-6">Thiết lập các ranh giới tri thức mới. Thêm các danh mục cụ thể giúp người đọc dễ dàng định hướng trong biển kiến thức mênh mông.</p>
                        <button onClick={() => openModal()} className="bg-[#EBE2CD] hover:bg-[#DFD3BA] text-[#5A4533] font-medium px-6 py-2.5 rounded-xl transition-colors cursor-pointer text-sm">
                            Định nghĩa bộ sưu tập mới
                        </button>
                    </div>
                </main>
            </div>

            {/* MODAL FORM (Khớp ảnh thiết kế image_d5fe1a.png) */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px] z-50">
                    <div className="bg-white rounded-[20px] w-full max-w-lg p-8 shadow-2xl">
                        <h2 className="text-xl font-bold text-[#1A202C] mb-6">
                            {formState.id ? 'Cập nhật thông tin Danh mục' : 'Thêm Danh mục mới'}
                        </h2>
                        <form onSubmit={handleSave} className="space-y-5">
                            <div>
                                <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase">
                                    Tên danh mục
                                </label>
                                <input
                                    type="text" required
                                    value={formState.categoryName}
                                    onChange={(e) => setFormState({...formState, categoryName: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#4B5A73] focus:ring-1 focus:ring-[#4B5A73] transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase">
                                    Mô tả (Tùy chọn)
                                </label>
                                <textarea
                                    rows={3}
                                    value={formState.description}
                                    onChange={(e) => setFormState({...formState, description: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#4B5A73] focus:ring-1 focus:ring-[#4B5A73] transition-colors"
                                />
                            </div>

                            <div className="flex justify-end gap-4 pt-4 border-t border-gray-100 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 cursor-pointer">
                                    Hủy bỏ
                                </button>
                                <button type="submit" className="px-6 py-2.5 text-sm font-medium text-white bg-[#4B5A73] hover:bg-[#39465B] rounded-xl cursor-pointer shadow-md">
                                    Lưu lại
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCategoryPage;