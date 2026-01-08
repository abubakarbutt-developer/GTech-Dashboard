import {
    Users,
    UserCheck,
    UserMinus,
    Search,
    Filter,
    Plus,
    Briefcase,
    Building2,
    Trash2,
    AlertTriangle,
    Edit,
    Eye,
    Mail
} from 'lucide-react';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { EmployeeData } from '../../types/employee';
import { useEmployees } from '../../hooks/useEmployees';

import Button from '../../components/UI/Button';
import './EmployeesPage.css';

const EmployeesPage = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const { employees, deleteEmployee } = useEmployees();

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState<number | null>(null);

    const handleDeleteClick = (id: number) => {
        setEmployeeToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleEditClick = (employee: EmployeeData) => {
        navigate(`/employees/edit/${employee.id}`);
    };

    const handleViewDetails = (employee: EmployeeData) => {
        navigate(`/employees/${employee.id}`);
    };


    const confirmDelete = () => {
        if (employeeToDelete !== null) {
            deleteEmployee(employeeToDelete);
            setIsDeleteModalOpen(false);
            setEmployeeToDelete(null);
        }
    };



    const filteredEmployees = employees.filter(employee =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        total: employees.length,
        active: employees.filter(e => e.status === 'active').length,
        inactive: employees.filter(e => e.status === 'inactive').length
    };

    return (
        <div className="employees-page fade-in">
            <div className="page-header">
                <div className="header-icon-box">
                    <Users size={28} />
                </div>
                <div className="header-text">
                    <h1>Employee <span className="gradient-text">Management</span></h1>
                    <p>View, manage and onboard employees within your organization</p>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="employees-stats-grid">
                <div className="employee-stat-card glass-card">
                    <div className="employee-stat-icon total">
                        <Users size={24} />
                    </div>
                    <div className="employee-stat-info">
                        <span className="employee-stat-label">Total Employees</span>
                        <span className="employee-stat-value">{stats.total}</span>
                    </div>
                </div>
                <div className="employee-stat-card glass-card">
                    <div className="employee-stat-icon active">
                        <UserCheck size={24} />
                    </div>
                    <div className="employee-stat-info">
                        <span className="employee-stat-label">Active Employees</span>
                        <span className="employee-stat-value">{stats.active}</span>
                    </div>
                </div>
                <div className="employee-stat-card glass-card">
                    <div className="employee-stat-icon inactive">
                        <UserMinus size={24} />
                    </div>
                    <div className="employee-stat-info">
                        <span className="employee-stat-label">Inactive Employees</span>
                        <span className="employee-stat-value">{stats.inactive}</span>
                    </div>
                </div>
            </div>

            {/* Employees List Controls */}
            <div className="employees-controls glass-card">
                <div className="search-wrapper">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by name, designation or department..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
                <div className="controls-right">
                    <Button variant="secondary" icon={<Filter size={18} />}>
                        Filter
                    </Button>
                    <Button variant="primary" onClick={() => navigate('/employees/new')} icon={<Plus size={18} />}>
                        Add Employee
                    </Button>
                </div>
            </div>

            {/* Employees Table */}
            <div className="employees-table-container glass-card">
                <table className="employees-table">
                    <thead>
                        <tr>
                            <th>Employee</th>
                            <th>CNIC / Contact</th>
                            <th>Designation</th>
                            <th>Department</th>
                            <th>Started Date</th>
                            <th>Salary</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredEmployees.map((employee) => (
                            <tr
                                key={employee.id}
                                className="employee-row"
                                onClick={() => handleViewDetails(employee)}
                                style={{ cursor: 'pointer' }}
                            >
                                <td>
                                    <div className="employee-cell">
                                        <div className="employee-avatar-small">
                                            {employee.name.charAt(0)}
                                        </div>
                                        <span className="employee-name-text">{employee.name}</span>
                                    </div>
                                </td>
                                <td>
                                    <div className="contact-cell">
                                        <span className="cnic-text">{employee.cnic}</span>
                                        <span className="phone-text">{employee.contact}</span>
                                    </div>
                                </td>
                                <td>
                                    <div className="designation-badge">
                                        <Briefcase size={14} />
                                        {employee.designation}
                                    </div>
                                </td>
                                <td>
                                    <div className="dept-text">
                                        <Building2 size={14} />
                                        {employee.department}
                                    </div>
                                </td>
                                <td>
                                    <span className="date-text">{employee.startedDate}</span>
                                </td>
                                <td>
                                    <span className="salary-text">Rs. {employee.salary}</span>
                                </td>
                                <td>
                                    <span className={`status-badge ${employee.status}`}>
                                        ● {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons" onClick={(e) => e.stopPropagation()}>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="action-btn view"
                                            onClick={() => handleViewDetails(employee)}
                                            title="View Employee Details"
                                            icon={<Eye size={18} />}
                                        />
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="action-btn edit"
                                            onClick={() => handleEditClick(employee)}
                                            title="Edit Employee Detail"
                                            icon={<Edit size={18} />}
                                        />
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="action-btn email"
                                            onClick={() => window.location.href = `mailto:${employee.companyEmail}`}
                                            title="Send Email"
                                            icon={<Mail size={18} />}
                                            disabled={!employee.companyEmail}
                                        />
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="action-btn delete"

                                            onClick={() => handleDeleteClick(employee.id)}
                                            title="Delete Employee"
                                            icon={<Trash2 size={18} />}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredEmployees.length === 0 && (
                    <div className="empty-results">
                        <Users size={48} />
                        <p>No employees found matching "{searchTerm}"</p>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content glass-card delete-modal slide-in">
                        <div className="delete-modal-icon">
                            <AlertTriangle size={48} />
                        </div>
                        <h2>Confirm <span className="gradient-text">Deletion</span></h2>
                        <p>Are you sure you want to remove this employee? This action cannot be undone and all associated records will be permanently deleted.</p>
                        <div className="modal-actions-confirm">
                            <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                            <Button variant="danger" onClick={confirmDelete}>Permanently Delete</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeesPage;
