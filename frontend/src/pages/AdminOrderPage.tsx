import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../components/admin/AdminSidebar';

// Bổ sung phoneNumber và shippingAddress vào Interface
interface OrderResponse {
    id: number;
    orderId: number;
    customerName: string;
    username: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    phoneNumber?: string;
    shippingAddress?: string;
}

const AdminOrderPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('Tất cả');
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // State quản lý cửa sổ Modal
    const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);

    const [totalElements, setTotalElements] = useState<number>(0);
    const [processingItems, setProcessingItems] = useState<number>(0);

    const tabs = ['Tất cả', 'Chờ xử lý', 'Đã giao', 'Hoàn tất', 'Đã hủy'];

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };
    };

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const statusEnum = getStatusParam(activeTab);
            let url = `http://localhost:8080/api/orders?page=0&size=10`;
            if (statusEnum !== '') {
                url += `&status=${statusEnum}`;
            }

            const response = await axios.get(url, getAuthHeaders());
            const data = response.data;

            if (data && data.items) {
                setOrders(data.items);
                setTotalElements(data.totalElements || 0);

                if (activeTab === 'Tất cả') {
                    setProcessingItems(data.processingItems || 0);
                }
            } else {
                setOrders([]);
            }
        } catch (error) {
            console.error("Lỗi khi tải danh sách đơn hàng:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [activeTab]);

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    const getInitials = (name: string) => {
        if (!name) return 'A';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'PENDING':
                return { label: 'CHỜ XỬ LÝ', style: 'bg-[#DEB887] text-[#5A3814]' };
            case 'SHIPPING':
            case 'CONFIRMED':
                return { label: 'ĐANG GIAO', style: 'bg-[#C5D0E6] text-[#2E4374]' };
            case 'DELIVERED':
            case 'COMPLETED':
                return { label: 'HOÀN TẤT', style: 'bg-[#EAE1CC] text-[#6B4F3B]' };
            case 'CANCELLED':
                return { label: 'ĐÃ HỦY', style: 'bg-[#F2D0D0] text-[#8B3A3A]' };
            default:
                return { label: status, style: 'bg-gray-200 text-gray-700' };
        }
    };

    const getStatusParam = (tab: string) => {
        switch (tab) {
            case 'Chờ xử lý': return 'PENDING';
            case 'Đã giao': return 'SHIPPING';
            case 'Hoàn tất': return 'COMPLETED';
            case 'Đã hủy': return 'CANCELLED';
            default: return '';
        }
    };

    const handleUpdateStatus = async (orderId: number, newStatus: string) => {
        const confirmMsg = newStatus === 'CANCELLED'
            ? 'Bạn có chắc chắn muốn HỦY đơn hàng này?'
            : 'Xác nhận cập nhật trạng thái đơn hàng?';

        if (!window.confirm(confirmMsg)) return;

        try {
            await axios.put(
                `http://localhost:8080/api/orders/${orderId}/status`,
                { status: newStatus },
                getAuthHeaders()
            );
            fetchOrders();
        } catch (error) {
            console.error("Lỗi cập nhật trạng thái:", error);
            alert("Có lỗi xảy ra khi cập nhật đơn hàng!");
        }
    };

    return (
        <div className="flex min-h-screen bg-[#FDFBF6] font-sans text-[#3D322A]">
            <AdminSidebar currentTab="orders" />

            <div className="flex-1 pl-64 flex flex-col relative">
                {/* --- HEADER --- */}
                <header className="flex justify-between items-center px-10 py-5 border-b border-[#F2EBE1] bg-[#FDFBF6]">
                    <div className="font-bold text-lg text-[#5A4533] tracking-wide">The Literati Archive</div>
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-gray-400 text-sm">🔍</span>
                            <input
                                type="text"
                                placeholder="Tìm kiếm nhanh..."
                                className="bg-[#F3EFE6] border-none rounded-full pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#CDBEAA] w-64 text-[#5A4533]"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-xs text-gray-500">Chào,</p>
                                <p className="text-sm font-semibold text-[#5A4533]">Admin</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-[#C5D0E6] text-[#2E4374] flex items-center justify-center font-bold">A</div>
                        </div>
                    </div>
                </header>

                {/* --- MAIN CONTENT --- */}
                <main className="p-10 flex-1 overflow-y-auto">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Kiểm soát kho</p>
                            <h1 className="text-3xl font-semibold text-[#3D322A]">Quản lý Đơn hàng</h1>
                        </div>
                        <div className="flex gap-3">
                            <button className="bg-transparent border border-[#CDBEAA] text-[#5A4533] font-medium px-4 py-2 rounded-full flex items-center gap-2 hover:bg-[#F3EFE6] transition-colors text-sm">
                                <span>=</span> Bộ lọc
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        {/* CỘT TRÁI: BẢNG ĐƠN HÀNG */}
                        <div className="xl:col-span-2 flex flex-col gap-6">
                            <div className="flex gap-8 border-b border-[#F2EBE1] px-2">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`pb-3 text-sm font-medium transition-colors relative ${
                                            activeTab === tab ? 'text-[#3D322A]' : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                    >
                                        {tab}
                                        {activeTab === tab && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#3D322A] rounded-t-full"></span>}
                                    </button>
                                ))}
                            </div>

                            <div className="bg-[#FDFBF6] rounded-xl border border-[#F2EBE1] overflow-hidden shadow-sm">
                                <table className="w-full text-left">
                                    <thead>
                                    <tr className="bg-[#F5F0E6] text-xs font-bold text-[#7E6A56] uppercase">
                                        <th className="py-4 px-6 w-[15%]">Mã Đơn</th>
                                        <th className="py-4 px-6 w-[25%]">Khách hàng</th>
                                        <th className="py-4 px-6 w-[15%]">Ngày đặt</th>
                                        <th className="py-4 px-6 w-[15%]">Tổng tiền</th>
                                        <th className="py-4 px-6 text-center w-[15%]">Trạng thái</th>
                                        <th className="py-4 px-6 text-center w-[15%]">Thao tác</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#F2EBE1]">
                                    {loading ? (
                                        <tr><td colSpan={6} className="text-center py-10 text-gray-500">Đang tải dữ liệu...</td></tr>
                                    ) : orders.map((order) => {
                                        const statusConf = getStatusConfig(order.status);
                                        const displayName = order.customerName || order.username || 'Khách ẩn danh';

                                        // Fix lỗi null ID: Lấy orderId, nếu không có mới dùng id
                                        const finalOrderId = order.orderId || order.id;

                                        return (
                                            <tr key={order.id} className="hover:bg-white transition-colors group">
                                                <td className="py-4 px-6 font-bold text-[#3D322A] text-sm">#{finalOrderId}</td>
                                                <td className="py-4 px-6 flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${statusConf.style}`}>
                                                        {getInitials(displayName)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-[#3D322A]">{displayName}</p>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-sm text-gray-600">{formatDate(order.createdAt)}</td>
                                                <td className="py-4 px-6 text-sm font-bold text-[#3D322A]">${order.totalAmount?.toLocaleString()}</td>
                                                <td className="py-4 px-6 text-center">
                                                    <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full whitespace-nowrap ${statusConf.style}`}>
                                                        {statusConf.label}
                                                    </span>
                                                </td>

                                                {/* CỘT THAO TÁC */}
                                                <td className="py-4 px-6 text-center">
                                                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">

                                                        {/* Nút Xem chi tiết bật Modal */}
                                                        <button
                                                            onClick={() => setSelectedOrder(order)}
                                                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Xem chi tiết"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                        </button>

                                                        {order.status === 'PENDING' && (
                                                            <>
                                                                <button onClick={() => handleUpdateStatus(finalOrderId, 'SHIPPING')} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Duyệt đơn & Giao hàng">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                                    </svg>
                                                                </button>
                                                                <button onClick={() => handleUpdateStatus(finalOrderId, 'CANCELLED')} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hủy đơn hàng">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                                    </svg>
                                                                </button>
                                                            </>
                                                        )}

                                                        {(order.status === 'SHIPPING' || order.status === 'CONFIRMED') && (
                                                            <button onClick={() => handleUpdateStatus(finalOrderId, 'COMPLETED')} className="p-1.5 text-gray-400 hover:text-[#5A3814] hover:bg-[#DEB887]/30 rounded-lg transition-colors" title="Đánh dấu hoàn tất">
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* CỘT PHẢI: WIDGETS THỐNG KÊ */}
                        <div className="xl:col-span-1 flex flex-col gap-6">
                            <div className="bg-[#5C3E21] rounded-2xl p-6 text-[#FDFBF6] shadow-lg relative overflow-hidden">
                                <div className="flex items-center gap-2 mb-4 text-[#CDBEAA]">
                                    <span>📊</span>
                                    <h3 className="font-medium text-sm tracking-wide">Tổng quan Hệ thống</h3>
                                </div>
                                <p className="text-sm leading-relaxed mb-6 text-gray-200">
                                    Có <b className="text-white">{processingItems}</b> đơn hàng đang chờ xử lý và giao hàng. Hãy kiểm tra thường xuyên!
                                </p>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-[#714D2A] rounded-xl p-4">
                                        <p className="text-[10px] text-[#CDBEAA] mb-1 font-bold">TỔNG ĐƠN</p>
                                        <p className="text-2xl font-bold">{totalElements}</p>
                                    </div>
                                    <div className="bg-[#714D2A] rounded-xl p-4">
                                        <p className="text-[10px] text-[#CDBEAA] mb-1 font-bold">ĐANG XỬ LÝ</p>
                                        <p className="text-2xl font-bold">{processingItems}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* --- CỬA SỔ MODAL CHI TIẾT ĐƠN HÀNG --- */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity">
                    <div className="bg-[#FDFBF6] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">

                        {/* Header */}
                        <div className="px-6 py-4 border-b border-[#F2EBE1] flex justify-between items-center bg-white">
                            <h3 className="text-lg font-bold text-[#3D322A]">
                                Chi tiết đơn hàng #{selectedOrder.orderId || selectedOrder.id}
                            </h3>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="text-gray-400 hover:text-red-500 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-4">
                            <div className="flex justify-between border-b border-[#F2EBE1] pb-3">
                                <span className="text-sm text-gray-500 font-medium">Người đặt:</span>
                                <span className="text-sm font-bold text-[#3D322A]">
                                    {selectedOrder.customerName || selectedOrder.username || 'Khách ẩn danh'}
                                </span>
                            </div>

                            <div className="flex justify-between border-b border-[#F2EBE1] pb-3">
                                <span className="text-sm text-gray-500 font-medium">Số điện thoại:</span>
                                <span className="text-sm font-bold text-[#3D322A]">
                                    {selectedOrder.phoneNumber || 'Không có'}
                                </span>
                            </div>

                            <div className="flex justify-between border-b border-[#F2EBE1] pb-3">
                                <span className="text-sm text-gray-500 font-medium">Địa chỉ giao hàng:</span>
                                <span className="text-sm font-bold text-[#3D322A] text-right max-w-[60%] leading-relaxed">
                                    {selectedOrder.shippingAddress || 'Không có'}
                                </span>
                            </div>

                            <div className="flex justify-between border-b border-[#F2EBE1] pb-3">
                                <span className="text-sm text-gray-500 font-medium">Trạng thái:</span>
                                <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusConfig(selectedOrder.status).style}`}>
                                    {getStatusConfig(selectedOrder.status).label}
                                </span>
                            </div>

                            <div className="flex justify-between pt-2 items-center">
                                <span className="text-base font-bold text-gray-500 uppercase tracking-wider">Thành tiền:</span>
                                <span className="text-2xl font-black text-[#5A3814]">
                                    ${selectedOrder.totalAmount?.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-[#F5F0E6] border-t border-[#F2EBE1] flex justify-end">
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="px-5 py-2.5 bg-white border border-[#CDBEAA] text-[#5A4533] rounded-xl text-sm font-bold hover:bg-[#F3EFE6] transition-colors shadow-sm"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrderPage;