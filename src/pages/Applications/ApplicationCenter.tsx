import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    CheckCircle2,
    XCircle,
    Clock,
    History,
    User,
    Calendar,
    FileText,
    X
} from 'lucide-react';
import initialApplicationsData from '../../api/applications.json';
import './ApplicationCenter.css';

interface LeaveApplication {
    id: string;
    employeeId: string;
    employeeName: string;
    type: 'leave' | 'short-leave' | 'other';
    reason: string;
    duration: string;
    appliedDate: string;
    status: 'pending' | 'approved' | 'rejected' | 'in-progress';
}

const initialApplications = initialApplicationsData as LeaveApplication[];

const ApplicationCenter: React.FC = () => {
    const [applications, setApplications] = useState<LeaveApplication[]>(() => {
        const saved = localStorage.getItem('gtech-applications');
        return saved ? JSON.parse(saved) : initialApplications;
    });


    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEmployeeHistory, setSelectedEmployeeHistory] = useState<string | null>(null);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('gtech-applications', JSON.stringify(applications));
    }, [applications]);

    const handleStatusChange = (id: string, newStatus: LeaveApplication['status']) => {
        setApplications(prev => prev.map(app =>
            app.id === id ? { ...app, status: newStatus } : app
        ));
    };

    const openHistory = (employeeId: string) => {
        setSelectedEmployeeHistory(employeeId);
        setIsHistoryModalOpen(true);
    };

    const filteredApps = applications.filter(app =>
        app.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.reason.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const employeeHistory = applications.filter(app => app.employeeId === selectedEmployeeHistory);
    const selectedEmployeeName = employeeHistory[0]?.employeeName || '';

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved': return <CheckCircle2 size={14} />;
            case 'rejected': return <XCircle size={14} />;
            case 'in-progress': return <Clock size={14} />;
            default: return <Clock size={14} />;
        }
    };

    const getAppTypeLabel = (type: string) => {
        switch (type) {
            case 'leave': return 'Leave Request';
            case 'short-leave': return 'Short Leave';
            default: return 'Other';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending': return 'Pending';
            case 'in-progress': return 'In Progress';
            case 'approved': return 'Approved';
            case 'rejected': return 'Rejected';
            default: return status;
        }
    };

    return (
        <div className="applications-page fade-in">
            <div className="page-header">
                <div className="header-icon-box">
                    <FileText size={28} />
                </div>
                <div className="header-text">
                    <h1>Application <span className="gradient-text">Center</span></h1>
                    <p>Manage employee leaves and short leaves</p>
                </div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ position: 'relative', flexGrow: 1 }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                        <input
                            type="text"
                            className="form-input"
                            style={{ paddingLeft: '40px' }}
                            placeholder="Search by name, ID or reason..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn-icon">
                        <Filter size={18} />
                    </button>
                </div>
            </div>

            <div className="applications-table-container glass-card">
                <table className="applications-table">
                    <thead>
                        <tr>
                            <th>Requested By</th>
                            <th>Type</th>
                            <th>Duration</th>
                            <th>Applied Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredApps.length > 0 ? (
                            filteredApps.map(app => (
                                <tr key={app.id}>
                                    <td>
                                        <div style={{ fontWeight: 600 }}>{app.employeeName}</div>
                                        <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>{app.employeeId}</div>
                                    </td>
                                    <td>
                                        <span className="app-type-tag">{getAppTypeLabel(app.type)}</span>
                                    </td>
                                    <td>{app.duration}</td>
                                    <td>{app.appliedDate}</td>
                                    <td>
                                        <div className={`app-status-badge status-${app.status}`}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                {getStatusIcon(app.status)}
                                                {getStatusLabel(app.status)}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <select
                                                className="form-input"
                                                style={{ width: '130px', padding: '4px 8px', fontSize: '0.85rem' }}
                                                value={app.status}
                                                onChange={(e) => handleStatusChange(app.id, e.target.value as any)}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="in-progress">In Progress</option>
                                                <option value="approved">Approved</option>
                                                <option value="rejected">Rejected</option>
                                            </select>
                                            <button
                                                className="btn-icon"
                                                title="View History"
                                                onClick={() => openHistory(app.employeeId)}
                                            >
                                                <History size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', opacity: 0.5 }}>
                                    <FileText size={48} style={{ margin: '0 auto 1rem', display: 'block' }} />
                                    No applications found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isHistoryModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content history-modal-content glass-card fade-in">
                        <div className="modal-header">
                            <h3>
                                <User size={20} style={{ marginRight: '10px' }} />
                                Employee Application History: <span className="gradient-text">{selectedEmployeeName}</span>
                            </h3>
                            <button className="close-btn" onClick={() => setIsHistoryModalOpen(false)}><X size={24} /></button>
                        </div>

                        <div className="history-timeline">
                            {employeeHistory.length > 0 ? (
                                employeeHistory.sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()).map(app => (
                                    <div key={app.id} className="history-card">
                                        <div className="history-info">
                                            <h4>{getAppTypeLabel(app.type)}</h4>
                                            <p>{app.reason} • {app.duration}</p>
                                            <div style={{ fontSize: '0.75rem', marginTop: '4px', opacity: 0.5 }}>
                                                <Calendar size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                                                {app.appliedDate}
                                            </div>
                                        </div>
                                        <div className={`app-status-badge status-${app.status}`}>
                                            {getStatusLabel(app.status)}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p style={{ textAlign: 'center', padding: '2rem', opacity: 0.5 }}>No history records found.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApplicationCenter;
