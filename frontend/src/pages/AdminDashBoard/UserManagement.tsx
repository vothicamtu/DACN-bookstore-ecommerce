import React, {useState} from 'react';
import {Search, Plus, Edit2, Trash2, Eye, EyeOff} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import "../../styles/UserManagement.css";

interface User {
    id: number;
    name: string;
    email: string;
    role: 'ADMIN' | 'USER';
    joinDate: string;
    status: 'active' | 'inactive';
}

const mockUsers: User[] = [
    {
        id: 1,
        name: 'Nguyễn Văn An',
        email: 'an.nguyenvan@example.com',
        role: 'ADMIN',
        joinDate: '10 tháng 05, 2023',
        status: 'active',
    },
    {
        id: 2,
        name: 'Trần Thị Gích',
        email: 'tran.thigich@example.com',
        role: 'USER',
        joinDate: '10 tháng 05, 2023',
        status: 'active',
    },
    {
        id: 3,
        name: 'Lê Hoàng Nam',
        email: 'le.hoangnam@example.com',
        role: 'USER',
        joinDate: '05 tháng 03, 2023',
        status: 'inactive',
    },
    {
        id: 4,
        name: 'Phạm Mỹ Linh',
        email: 'pham.mylinh@example.com',
        role: 'USER',
        joinDate: '22 tháng 9, 2023',
        status: 'active',
    },
];

export default function UserManagement() {
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState<'ALL' | 'ADMIN' | 'USER'>('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const [showForm, setShowForm] = useState(false);

    const itemsPerPage = 8;
    const filteredUsers = users.filter((user) => {
        const matchSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchRole = filterRole === 'ALL' || user.role === filterRole;
        return matchSearch && matchRole;
    });

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const stats = {
        totalUsers: users.length,
        activeUsers: users.filter((u) => u.status === 'active').length,
        admins: users.filter((u) => u.role === 'ADMIN').length,
        inactiveUsers: users.filter((u) => u.status === 'inactive').length,
    };

    const handleDeleteUser = (id: number) => {
        if (confirm('Bạn chắc chắn muốn xóa người dùng này?')) {
            setUsers(users.filter((user) => user.id !== id));
        }
    };


    return (
        <AdminLayout>
            <div className="user-management">
                {/* Header */}
                <div className="user-management__header">
                    <div>
                        <h1 className="user-management__title">Quản lý người dùng</h1>
                        <p className="user-management__subtitle">
                            Quản lý danh sách thành viên và phân quyền hệ thống
                        </p>
                    </div>
                    <button className="btn-primary btn-add-user" onClick={() => setShowForm(!showForm)}>
                        <Plus size={18}/>
                        <span>Thêm người dùng mới</span>
                    </button>
                </div>

                {/* Stats */}
                <div className="user-stats">
                    <div className="stat-card">
                        <div className="stat-card__icon stat-card__icon--blue">
                            <span>👥</span>
                        </div>
                        <div className="stat-card__content">
                            <p className="stat-card__label">Tổng người dùng</p>
                            <p className="stat-card__value">{stats.totalUsers}</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-card__icon stat-card__icon--green">
                            <span>✓</span>
                        </div>
                        <div className="stat-card__content">
                            <p className="stat-card__label">Đang hoạt động</p>
                            <p className="stat-card__value">{stats.activeUsers}</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-card__icon stat-card__icon--orange">
                            <span>👔</span>
                        </div>
                        <div className="stat-card__content">
                            <p className="stat-card__label">Tài khoản Admin</p>
                            <p className="stat-card__value">{stats.admins}</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-card__icon stat-card__icon--red">
                            <span>⭕</span>
                        </div>
                        <div className="stat-card__content">
                            <p className="stat-card__label">Bị khóa</p>
                            <p className="stat-card__value">{stats.inactiveUsers}</p>
                        </div>
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="user-controls">
                    <div className="search-box">
                        <Search size={18} className="search-box__icon"/>
                        <input
                            type="text"
                            placeholder="Tìm kiếm người dùng..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="search-box__input"
                        />
                    </div>

                    <div className="filter-tabs">
                        <button
                            className={`filter-tab ${filterRole === 'ALL' ? 'is-active' : ''}`}
                            onClick={() => {
                                setFilterRole('ALL');
                                setCurrentPage(1);
                            }}
                        >
                            Tất cả
                        </button>
                        <button
                            className={`filter-tab ${filterRole === 'ADMIN' ? 'is-active' : ''}`}
                            onClick={() => {
                                setFilterRole('ADMIN');
                                setCurrentPage(1);
                            }}
                        >
                            Quản trị viên
                        </button>
                        <button
                            className={`filter-tab ${filterRole === 'USER' ? 'is-active' : ''}`}
                            onClick={() => {
                                setFilterRole('USER');
                                setCurrentPage(1);
                            }}
                        >
                            Người dùng
                        </button>
                    </div>

                    <button className="btn-sort">
                        <span>⬇ Sổ lạc hàng cấp</span>
                    </button>
                </div>

                {/* Table */}
                <div className="user-table-container">
                    <table className="user-table">
                        <thead>
                        <tr>
                            <th>NGƯỜI DÙNG</th>
                            <th>VĂI TRÒ</th>
                            <th>NGÀY ĐĂNG KÝ</th>
                            <th>TRẠNG THÁI</th>
                            <th>THAO TÁC</th>
                        </tr>
                        </thead>
                        <tbody>
                        {paginatedUsers.map((user) => (
                            <tr key={user.id} className="user-row">
                                <td>
                                    <div className="user-info">
                                        <div className="user-avatar">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="user-details">
                                            <p className="user-name">{user.name}</p>
                                            <p className="user-email">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td>
                    <span className={`role-badge role-badge--${user.role.toLowerCase()}`}>
                      {user.role}
                    </span>
                                </td>
                                <td>{user.joinDate}</td>
                                <td>
                    <span
                        className={`status-badge status-badge--${user.status}`}
                    >
                      {user.status === 'active' ? '✓ Hoạt động' : '⭕ Bị khóa'}
                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button
                                            className="btn-action btn-action--view"
                                            title="Xem chi tiết"
                                        >
                                            <Eye size={16}/>
                                        </button>
                                        <button
                                            className="btn-action btn-action--edit"
                                            title="Chỉnh sửa"
                                        >
                                            <Edit2 size={16}/>
                                        </button>
                                        <button
                                            className="btn-action btn-action--delete"
                                            title="Xóa"
                                            onClick={() => handleDeleteUser(user.id)}
                                        >
                                            <Trash2 size={16}/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="pagination">
          <span className="pagination__info">
            1 - {Math.min(itemsPerPage, filteredUsers.length)} của {filteredUsers.length} bản ghi
          </span>
                    <div className="pagination__controls">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                            className="pagination__btn"
                        >
                            &lt;
                        </button>
                        {Array.from({length: totalPages}, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`pagination__btn ${currentPage === page ? 'is-active' : ''}`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(currentPage + 1)}
                            className="pagination__btn"
                        >
                            &gt;
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
