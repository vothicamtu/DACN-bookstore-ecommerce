import React, { useState } from 'react';
import { Menu, X, LogOut, Settings } from 'lucide-react';
import AdminSidebar from './AdminSideBar';
import "../../styles/AdminLayout.css";

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <AdminSidebar isOpen={sidebarOpen} />

            {/* Main Content */}
            <div className="admin-layout__main">
                {/* Header */}
                <header className="admin-header">
                    <div className="admin-header__left">
                        <button
                            className="admin-header__toggle"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            aria-label="Toggle sidebar"
                        >
                            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                    <div className="admin-header__right">
                        <button className="admin-header__icon-btn" title="Cài đặt">
                            <Settings size={20} />
                        </button>
                        <button className="admin-header__logout" title="Đăng xuất">
                            <LogOut size={20} />
                            <span>Đăng xuất</span>
                        </button>
                    </div>
                </header>

                {/* Content */}
                <main className="admin-layout__content">
                    {children}
                </main>
            </div>
        </div>
    );
}
