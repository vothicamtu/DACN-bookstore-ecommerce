import React from 'react';

interface AdminSidebarProps {
    currentTab: string;
    onTabChange?: (tab: string) => void; // Thêm prop này để truyền sự kiện lên trang cha
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ currentTab, onTabChange }) => {

    // Hàm Helper để render style hoặc class cho active item dễ dàng hơn
    const getActiveStyle = (tabName: string) => {
        return currentTab === tabName
            ? { backgroundColor: '#D9C5B2', color: '#5C4033', fontWeight: 'bold' }
            : {};
    };

    const handleTabClick = (tabName: string) => {
        if (onTabChange) {
            onTabChange(tabName);
        }
    };

    return (
        <div className="w-64 min-h-screen p-6 flex flex-col justify-between fixed left-0 top-0 border-r border-[#EAE2D5]" style={{ backgroundColor: '#F5EFE4' }}>
            <div>
                {/* Logo */}
                <h2 className="text-3xl font-bold tracking-wide mb-6" style={{ color: '#5C4033' }}>Lưu trữ<br />Literati</h2>

                {/* Thông tin Admin */}
                <div className="flex items-center gap-3 p-3 rounded-xl mb-8 border border-[#EAE2D5]" style={{ backgroundColor: '#FAF6EE' }}>
                    <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60"
                        alt="Avatar"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                        <div className="font-bold text-sm text-[#333]">Atelier Admin</div>
                        <div className="text-xs text-gray-500">Quản thủ trưởng</div>
                    </div>
                </div>

                {/* Menu Items */}
                <nav className="flex flex-col gap-2 text-sm font-medium text-gray-600">
                    <button
                        onClick={() => handleTabClick('users')}
                        className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-[#EAE2D5]/50 transition-colors text-left cursor-pointer"
                        style={getActiveStyle('users')}
                    >
                        <span>👥</span> Quản lý người dùng
                    </button>

                    <button
                        onClick={() => handleTabClick('books')}
                        className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-[#EAE2D5]/50 transition-colors text-left cursor-pointer"
                        style={getActiveStyle('books')}
                    >
                        <span>📖</span> Sách
                    </button>

                    <button
                        onClick={() => handleTabClick('categories')}
                        className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-[#EAE2D5]/50 transition-colors text-left cursor-pointer"
                        style={getActiveStyle('categories')}
                    >
                        <span>☱</span> Danh mục
                    </button>

                    <button
                        onClick={() => handleTabClick('orders')}
                        className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-[#EAE2D5]/50 transition-colors text-left cursor-pointer"
                        style={getActiveStyle('orders')}
                    >
                        <span>🛒</span> Đơn hàng
                    </button>

                    <button
                        onClick={() => handleTabClick('reports')}
                        className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-[#EAE2D5]/50 transition-colors text-left cursor-pointer"
                        style={getActiveStyle('reports')}
                    >
                        <span>📊</span> Báo cáo
                    </button>
                </nav>
            </div>

            <div className="text-xs text-gray-400">
                Phiên bản 2.1.0
            </div>
        </div>
    );
};

export default AdminSidebar;