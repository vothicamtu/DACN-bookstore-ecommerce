import React from 'react';
import { LayoutDashboard, Users, BookOpen, ShoppingBag, BarChart3, Settings } from 'lucide-react';
import "../../styles/AdminSideBar.css";

interface AdminSidebarProps {
    isOpen: boolean;
}

const menuItems = [
    {
        icon: LayoutDashboard,
        label: 'Dashboard',
        href: '/admin',
        badge: null,
    },
    {
        icon: Users,
        label: 'Quản lý người dùng',
        href: '/admin/users',
        badge: null,
    },
    {
        icon: BookOpen,
        label: 'Quản lý sách',
        href: '/admin/books',
        badge: 12,
    },
    {
        icon: ShoppingBag,
        label: 'Quản lý đơn hàng',
        href: '/admin/orders',
        badge: 5,
    },
    {
        icon: BarChart3,
        label: 'Báo cáo & Thống kê',
        href: '/admin/reports',
        badge: null,
    },
    {
        icon: Settings,
        label: 'Cài đặt hệ thống',
        href: '/admin/settings',
        badge: null,
    },
];

export default function AdminSidebar({ isOpen }: AdminSidebarProps) {
    return (
        <aside className={`admin-sidebar ${isOpen ? 'is-open' : ''}`}>
            {/* Logo */}
            <div className="admin-sidebar__header">
                <div className="admin-logo">
                    <span className="admin-logo__icon">📚</span>
                    <div className="admin-logo__text">
                        <p className="admin-logo__title">BookLand</p>
                        <p className="admin-logo__subtitle">Admin</p>
                    </div>
                </div>
            </div>

            {/* Menu */}
            <nav className="admin-menu">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.href === '/admin/users'; // For demo

                    return (
                        <a
                            key={item.href}
                            href={item.href}
                            className={`admin-menu__item ${isActive ? 'is-active' : ''}`}
                        >
                            <Icon size={20} className="admin-menu__icon" />
                            <span className="admin-menu__label">{item.label}</span>
                            {item.badge && (
                                <span className="admin-menu__badge">{item.badge}</span>
                            )}
                        </a>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="admin-sidebar__footer">
                <div className="admin-user">
                    <div className="admin-user__avatar">A</div>
                    <div className="admin-user__info">
                        <p className="admin-user__name">Admin BookLand</p>
                        <p className="admin-user__role">Quản trị viên</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
