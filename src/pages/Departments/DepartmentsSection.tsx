import {
    Code,
    Palette,
    ShieldCheck,
    Server,
    Layers,
    Users,
    Megaphone,
    ChevronRight,
    Search,
    Smartphone,
    X,
    Mail,
    Phone,
    Building2
} from 'lucide-react';
import { useState } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import departmentsData from '../../api/departments.json';
import './DepartmentsSection.css';

interface Department {
    id: number;
    name: string;
    description: string;
    head: string;
    employeeCount: number;
    icon: any;
    color: string;
    isFacilities?: boolean;
}

const iconMap: Record<string, any> = {
    Code,
    Palette,
    ShieldCheck,
    Server,
    Layers,
    Users,
    Smartphone,
    Megaphone,
    Building2
};

const departments: Department[] = departmentsData.map(dept => ({
    ...dept,
    icon: iconMap[dept.icon as keyof typeof iconMap] || Building2
}));


interface DepartmentsSectionProps {
    onNavigate?: (page: string) => void;
}

const DepartmentsSection = ({ onNavigate }: DepartmentsSectionProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDept, setSelectedDept] = useState<Department | null>(null);
    const [allEmployees] = useLocalStorage<any[]>('employees-data', []);

    const filteredDepartments = departments.filter(dept =>
        dept.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getDeptEmployees = (deptName: string) => {
        return allEmployees.filter(emp => emp.department === deptName);
    };

    const handleViewDetails = (dept: Department) => {
        if (dept.isFacilities && onNavigate) {
            onNavigate('facilities');
        } else {
            setSelectedDept(dept);
        }
    };

    return (
        <div className="departments-section fade-in">
            <div className="section-header-flex">
                <div className="header-content-left">
                    <h3 className="section-title">Software House <span className="gradient-text">Departments</span></h3>
                    <p className="section-subtitle">Overview of organizational structure and teams</p>
                </div>
                <div className="search-bar-mini glass-card">
                    <Search size={16} />
                    <input
                        type="text"
                        placeholder="Search departments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="departments-grid">
                {filteredDepartments.map((dept) => (
                    <div key={dept.id} className="dept-card glass-card">
                        <div className="dept-icon-wrapper" style={{ background: dept.color }}>
                            <dept.icon size={24} color="#fff" />
                        </div>
                        <div className="dept-info">
                            <h4 className="dept-name">{dept.name}</h4>
                            <p className="dept-desc">{dept.description}</p>
                            <div className="dept-meta">
                                <div className="meta-item">
                                    <span className="meta-label">Head:</span>
                                    <span className="meta-value">{dept.head}</span>
                                </div>
                                <div className="meta-item">
                                    <span className="meta-label">Team:</span>
                                    <span className="meta-value">{dept.employeeCount} Members</span>
                                </div>
                            </div>
                        </div>
                        <button
                            className="dept-action-btn"
                            title="View Details"
                            onClick={() => handleViewDetails(dept)}
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Department Detail Modal */}
            {selectedDept && (
                <div className="modal-overlay">
                    <div className="modal-content dept-detail-modal glass-card slide-in">
                        <div className="modal-header">
                            <div className="header-with-icon">
                                <div className="dept-icon-mini" style={{ background: selectedDept.color }}>
                                    <selectedDept.icon size={20} color="#fff" />
                                </div>
                                <div className="title-group">
                                    <h2>{selectedDept.name} <span className="gradient-text">Details</span></h2>
                                    <p>{selectedDept.description}</p>
                                </div>
                            </div>
                            <button className="close-btn" onClick={() => setSelectedDept(null)}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="dept-details-grid">
                            {/* Team Lead Section */}
                            <div className="lead-section glass-card">
                                <h4 className="detail-subtitle">Department <span className="gradient-text">Lead</span></h4>
                                <div className="lead-card-inner">
                                    <div className="lead-avatar">
                                        {selectedDept.head.charAt(0)}
                                    </div>
                                    <div className="lead-info">
                                        <span className="lead-name">{selectedDept.head}</span>
                                        <span className="lead-designation">Department Head</span>
                                        <div className="lead-contact">
                                            <div className="contact-item"><Mail size={14} /> {selectedDept.head.toLowerCase().replace(' ', '.')}@gtech.com</div>
                                            <div className="contact-item"><Phone size={14} /> +92 300 0000000</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Summary */}
                            <div className="dept-stats-mini">
                                <div className="stat-box glass-card">
                                    <span className="stat-val">{getDeptEmployees(selectedDept.name).length}</span>
                                    <span className="stat-lab">Active Employees</span>
                                </div>
                                <div className="stat-box glass-card">
                                    <span className="stat-val">Rs. 450K+</span>
                                    <span className="stat-lab">Monthly Budget</span>
                                </div>
                            </div>

                            {/* Employee List Section */}
                            <div className="dept-employees-section glass-card">
                                <h4 className="detail-subtitle">Team <span className="gradient-text">Members</span></h4>
                                <div className="dept-employees-table-wrapper">
                                    <table className="dept-employees-table">
                                        <thead>
                                            <tr>
                                                <th>Member</th>
                                                <th>Designation</th>
                                                <th>Contact</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {getDeptEmployees(selectedDept.name).length > 0 ? (
                                                getDeptEmployees(selectedDept.name).map(emp => (
                                                    <tr key={emp.id}>
                                                        <td>
                                                            <div className="member-cell">
                                                                <div className="member-avatar-tiny">{emp.name.charAt(0)}</div>
                                                                <span>{emp.name}</span>
                                                            </div>
                                                        </td>
                                                        <td>{emp.designation}</td>
                                                        <td>{emp.contact}</td>
                                                        <td>
                                                            <span className={`status-dot ${emp.status}`}></span>
                                                            {emp.status}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={4} className="no-members">No team members assigned to this department yet.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DepartmentsSection;
