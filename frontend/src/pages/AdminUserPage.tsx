import React, { useEffect, useState } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import axiosClient from '../api/axiosClient';
import axios from 'axios';

// Định nghĩa cấu trúc hứng dữ liệu trực tiếp tại đây
interface UserResponse {
    id: number;
    fullName: string;
    email: string;
    username: string;
    role: string;
    status: string;
}

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

const AdminUserPage: React.FC = () => {
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        setLoading(true);

        // Sử dụng đường dẫn TUYỆT ĐỐI 100% giống trên trình duyệt của bạn
        axios.get('http://localhost:8080/api/admin/users')
            .then(response => {
                // Kiểm tra cấu trúc phản hồi từ Spring Boot
                if (response.data && response.data.success) {
                    setUsers(response.data.data); // Gán mảng vào state
                }
            })
            .catch(error => {
                console.error("Lỗi kết nối kiểm tra:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // Logic tìm kiếm nhanh theo tên hoặc email
    const filteredUsers = users.filter(user =>
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRoleBadgeStyle = (role: string) => {
        return role === 'Quản trị viên'
            ? { backgroundColor: '#E6B89C', color: '#5C3A21' }
            : { backgroundColor: 'transparent', color: '#4A3728', border: '1px solid #4A3728' };
    };

    return (
        <div className="flex min-h-screen" style={{ backgroundColor: '#FEFAF0' }}>
            <AdminSidebar currentTab="users" />

            <main className="flex-1 pl-72 pr-10 py-10">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-4xl font-bold text-[#1A1A1A] mb-2 font-serif">Quản lý Người dùng</h2>
                        <p className="text-gray-600 text-sm">Giám sát các học giả, quản thư và độc giả của kho lưu trữ.</p>
                    </div>
                </div>

                <div className="p-4 rounded-xl flex items-center gap-4 mb-6" style={{ backgroundColor: '#F3EAD3', border: '1px solid #EAE2D5' }}>
                    <div className="relative flex-1">
                        <span className="absolute left-4 top-3 text-gray-400">🔍</span>
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên, email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-xl py-2.5 pl-11 pr-4 outline-none text-[#4A3728] text-sm"
                            style={{ backgroundColor: '#E9DFB9' }}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-[#8B735B]">Đang đồng bộ dữ liệu thư viện...</div>
                ) : (
                    <div className="rounded-xl overflow-hidden border border-[#EAE2D5]" style={{ backgroundColor: '#F3EAD3' }}>
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="text-[#8B735B] uppercase text-xs font-bold border-b border-[#E9DFB9]">
                                <th className="px-6 py-4">Thành viên</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Vai trò</th>
                                <th className="px-6 py-4">Trạng thái</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E9DFB9]">
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="hover:bg-[#EEDCB3]/30 transition-colors">
                                    <td className="px-6 py-4 text-[#4A3728]">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-[#D9C5B2] flex items-center justify-center text-[#5C4033] font-bold text-sm">
                                                {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-[#1A1A1A]">{user.fullName}</span>
                                                <span className="text-xs text-gray-500">@{user.username}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-[#4A3728] text-sm font-medium">{user.email}</td>
                                    <td className="px-6 py-4">
                                            <span className="px-3 py-1 rounded-full text-xs font-bold" style={getRoleBadgeStyle(user.role)}>
                                                {user.role}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm font-semibold">
                                            <span className="text-green-600">●</span>
                                            <span className="text-[#4A3728]">{user.status}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminUserPage;