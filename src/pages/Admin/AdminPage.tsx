import {
    Shield,
    UserPlus,
    Edit3,
    Trash2,
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    CheckCircle2
} from 'lucide-react';
import { useState } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import initialUsersData from '../../api/users.json';
import './AdminPage.css';

interface DashboardUser {
    id: string;
    name: string;
    role: 'Admin' | 'Editor' | 'Staff';
    email: string;
}

const initialUsers = initialUsersData as DashboardUser[];

const AdminPage = () => {
    // State for creating users
    const [users, setUsers] = useLocalStorage<DashboardUser[]>('dashboard-users', initialUsers);


    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newUserData, setNewUserData] = useState({
        name: '',
        userId: '',
        role: 'Staff' as 'Admin' | 'Editor' | 'Staff',
        password: '',
        confirmPassword: ''
    });

    const [showPassword, setShowPassword] = useState(false);

    // State for editing admin details
    const [adminDetails, setAdminDetails] = useLocalStorage('admin-details', {
        name: 'Super Admin',
        email: 'admin@gtech.com',
        currentPassword: '',
        newPassword: ''
    });

    const handleCreateUser = (e: React.FormEvent) => {
        e.preventDefault();
        const newUser: DashboardUser = {
            id: newUserData.userId,
            name: newUserData.name,
            role: newUserData.role,
            email: `${newUserData.userId}@gtech.com`
        };
        setUsers([...users, newUser]);
        setIsCreateModalOpen(false);
        setNewUserData({ name: '', userId: '', role: 'Staff', password: '', confirmPassword: '' });
    };

    const handleUpdateAdmin = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically make an API call
        alert('Admin details updated successfully!');
    };

    return (
        <div className="admin-page fade-in">
            <div className="admin-grid">
                {/* Admin Details Section */}
                <div className="admin-section glass-card">
                    <div className="section-header">
                        <Shield className="section-icon" size={24} />
                        <h2>Edit <span className="gradient-text">Admin Details</span></h2>
                    </div>
                    <form onSubmit={handleUpdateAdmin} className="admin-form">
                        <div className="form-group">
                            <label><User size={16} /> Admin Name</label>
                            <input
                                type="text"
                                value={adminDetails.name}
                                onChange={(e) => setAdminDetails({ ...adminDetails, name: e.target.value })}
                                placeholder="Edit administrator name"
                            />
                        </div>
                        <div className="form-group">
                            <label><Mail size={16} /> Admin Email</label>
                            <input
                                type="email"
                                value={adminDetails.email}
                                onChange={(e) => setAdminDetails({ ...adminDetails, email: e.target.value })}
                                placeholder="Edit contact email"
                            />
                        </div>
                        <div className="form-divider">Update Password</div>
                        <div className="form-group">
                            <label><Lock size={16} /> New Password</label>
                            <input
                                type="password"
                                value={adminDetails.newPassword}
                                onChange={(e) => setAdminDetails({ ...adminDetails, newPassword: e.target.value })}
                                placeholder="Leave blank to keep current"
                            />
                        </div>
                        <button type="submit" className="btn-primary">
                            <CheckCircle2 size={18} />
                            Save Changes
                        </button>
                    </form>
                </div>

                {/* Dashboard Users List */}
                <div className="admin-section glass-card">
                    <div className="section-header">
                        <UserPlus className="section-icon" size={24} />
                        <h2>Dashboard <span className="gradient-text">Users</span></h2>
                        <button className="btn-add-user" onClick={() => setIsCreateModalOpen(true)}>
                            <UserPlus size={18} />
                            Create User
                        </button>
                    </div>

                    <div className="users-list">
                        {users.map(user => (
                            <div key={user.id} className="user-item">
                                <div className="user-info">
                                    <div className="user-avatar">{user.name.charAt(0)}</div>
                                    <div className="user-meta">
                                        <span className="user-name">{user.name}</span>
                                        <span className="user-id">ID: {user.id}</span>
                                    </div>
                                </div>
                                <div className="user-actions">
                                    <span className={`role-tag ${user.role.toLowerCase()}`}>{user.role}</span>
                                    <button className="icon-btn"><Edit3 size={16} /></button>
                                    <button className="icon-btn delete"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Create User Modal */}
            {isCreateModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content glass-card slide-in">
                        <div className="modal-header">
                            <h2>Create New <span className="gradient-text">Dashboard User</span></h2>
                            <button className="close-btn" onClick={() => setIsCreateModalOpen(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleCreateUser} className="modal-form">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newUserData.name}
                                    onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                                    placeholder="Enter user's full name"
                                />
                            </div>
                            <div className="form-group">
                                <label>Login ID</label>
                                <input
                                    type="text"
                                    required
                                    value={newUserData.userId}
                                    onChange={(e) => setNewUserData({ ...newUserData, userId: e.target.value })}
                                    placeholder="e.g. jdoe_admin"
                                />
                            </div>
                            <div className="form-group">
                                <label>Dashboard Role</label>
                                <select
                                    value={newUserData.role}
                                    onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value as any })}
                                >
                                    <option value="Staff">Staff</option>
                                    <option value="Editor">Editor</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <div className="password-input-wrapper">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={newUserData.password}
                                        onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                                        placeholder="Create a strong password"
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                            <div className="form-actions">
                                <button type="button" className="btn-secondary" onClick={() => setIsCreateModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">Create Account</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPage;
