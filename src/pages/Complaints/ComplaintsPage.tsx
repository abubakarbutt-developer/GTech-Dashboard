import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    Trash2,
    MessageSquare,
    Send,
    X,
    FileText,
    History as HistoryIcon,
    Plus
} from 'lucide-react';
import initialComplaintsData from '../../api/complaints.json';
import Button from '../../components/UI/Button';
import './ComplaintsPage.css';

interface ComplaintReply {
    id: string;
    sender: 'admin' | 'user';
    text: string;
    timestamp: string;
}

interface Complaint {
    id: string;
    complainant: string;
    employeeId: string;
    subject: string;
    description: string;
    date: string;
    status: 'active' | 'in-progress' | 'completed';
    replies: ComplaintReply[];
}

const initialComplaints = initialComplaintsData as Complaint[];

const ComplaintsPage: React.FC = () => {
    const [complaints, setComplaints] = useState<Complaint[]>(() => {
        const saved = localStorage.getItem('gtech-complaints');
        return saved ? JSON.parse(saved) : initialComplaints;
    });


    const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
    const [replyText, setReplyText] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newComplaint, setNewComplaint] = useState({
        complainant: '',
        employeeId: '',
        subject: '',
        description: ''
    });

    useEffect(() => {
        localStorage.setItem('gtech-complaints', JSON.stringify(complaints));
    }, [complaints]);

    const handleStatusChange = (id: string, newStatus: 'active' | 'in-progress' | 'completed') => {
        setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
        if (selectedComplaint && selectedComplaint.id === id) {
            setSelectedComplaint(prev => prev ? { ...prev, status: newStatus } : null);
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this complaint?')) {
            setComplaints(prev => prev.filter(c => c.id !== id));
            if (selectedComplaint && selectedComplaint.id === id) {
                setIsViewModalOpen(false);
            }
        }
    };

    const handleSendReply = (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyText.trim() || !selectedComplaint) return;

        const newReply: ComplaintReply = {
            id: Date.now().toString(),
            sender: 'admin',
            text: replyText,
            timestamp: new Date().toLocaleString()
        };

        const updatedComplaints = complaints.map(c =>
            c.id === selectedComplaint.id
                ? { ...c, replies: [...c.replies, newReply] }
                : c
        );

        setComplaints(updatedComplaints);
        setReplyText('');
        setSelectedComplaint(prev => prev ? { ...prev, replies: [...prev.replies, newReply] } : null);
    };

    const handleAddComplaint = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form
        if (!newComplaint.complainant.trim() || !newComplaint.employeeId.trim() ||
            !newComplaint.subject.trim() || !newComplaint.description.trim()) {
            alert('Please fill in all fields');
            return;
        }

        const complaint: Complaint = {
            id: Date.now().toString(),
            complainant: newComplaint.complainant,
            employeeId: newComplaint.employeeId,
            subject: newComplaint.subject,
            description: newComplaint.description,
            date: new Date().toLocaleDateString(),
            status: 'active',
            replies: []
        };

        setComplaints(prev => [complaint, ...prev]);
        setNewComplaint({
            complainant: '',
            employeeId: '',
            subject: '',
            description: ''
        });
        setIsAddModalOpen(false);
    };


    const filteredComplaints = complaints.filter(c =>
        c.complainant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'active': return 'Active';
            case 'in-progress': return 'In Progress';
            case 'completed': return 'Completed';
            default: return status;
        }
    };

    return (
        <div className="complaints-page fade-in">
            <div className="page-header">
                <div className="header-icon-box">
                    <MessageSquare size={28} />
                </div>
                <div className="header-text">
                    <h1>Grievance <span className="gradient-text">Center</span></h1>
                    <p>Employee grievances and resolution center</p>
                </div>
                <div className="header-actions">
                    <Button variant="primary" onClick={() => setIsAddModalOpen(true)} icon={<Plus size={18} />}>
                        Add Complaint
                    </Button>
                </div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                <div className="search-bar" style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ position: 'relative', flexGrow: 1 }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                        <input
                            type="text"
                            className="form-input"
                            style={{ paddingLeft: '40px' }}
                            placeholder="Search by name, ID or subject..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="secondary" className="btn-icon" icon={<Filter size={18} />} />
                </div>
            </div>

            <div className="complaints-table-container glass-card">
                <table className="complaints-table">
                    <thead>
                        <tr>
                            <th>Complainant</th>
                            <th>Subject</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredComplaints.length > 0 ? (
                            filteredComplaints.map(complaint => (
                                <tr key={complaint.id}>
                                    <td>
                                        <div style={{ fontWeight: 600 }}>{complaint.complainant}</div>
                                        <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>{complaint.employeeId}</div>
                                    </td>
                                    <td>{complaint.subject}</td>
                                    <td>{complaint.date}</td>
                                    <td>
                                        <span className={`status-badge status-${complaint.status}`}>
                                            {getStatusLabel(complaint.status)}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="complaint-actions">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="btn-icon"
                                                onClick={() => {
                                                    setSelectedComplaint(complaint);
                                                    setIsViewModalOpen(true);
                                                }}
                                                title="Reply"
                                                icon={<MessageSquare size={16} />}
                                            />
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="btn-icon delete"
                                                onClick={() => handleDelete(complaint.id)}
                                                title="Delete Complaint"
                                                icon={<Trash2 size={16} />}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', opacity: 0.5 }}>
                                    <FileText size={48} style={{ margin: '0 auto 1rem', display: 'block' }} />
                                    No complaints found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isViewModalOpen && selectedComplaint && (
                <div className="modal-overlay">
                    <div className="modal-content glass-card fade-in" style={{ maxWidth: '800px' }}>
                        <div className="modal-header">
                            <h3>Complaint Details</h3>
                            <Button variant="ghost" className="close-btn" onClick={() => setIsViewModalOpen(false)} icon={<X size={24} />} />
                        </div>

                        <div className="complaint-view overflow-y-auto" style={{ maxHeight: '70vh' }}>
                            <div className="info-grid">
                                <div className="info-item">
                                    <label>Complainant</label>
                                    <span>{selectedComplaint.complainant} ({selectedComplaint.employeeId})</span>
                                </div>
                                <div className="info-item">
                                    <label>Date</label>
                                    <span>{selectedComplaint.date}</span>
                                </div>
                                <div className="info-item">
                                    <label>Subject</label>
                                    <span>{selectedComplaint.subject}</span>
                                </div>
                                <div className="info-item">
                                    <label>Status</label>
                                    <select
                                        className="form-input"
                                        style={{ paddingTop: '2px', paddingBottom: '2px' }}
                                        value={selectedComplaint.status}
                                        onChange={(e) => handleStatusChange(selectedComplaint.id, e.target.value as any)}
                                    >
                                        <option value="active">Active</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                            </div>

                            <div className="info-item">
                                <label>Description</label>
                                <div className="complaint-text-box">
                                    {selectedComplaint.description}
                                </div>
                            </div>

                            <div className="reply-section">
                                <label><HistoryIcon size={14} style={{ marginRight: '5px' }} /> Communication History</label>
                                <div className="reply-list glass-card">
                                    {selectedComplaint.replies.length > 0 ? (
                                        selectedComplaint.replies.map((reply) => (
                                            <div key={reply.id} className={`reply-item reply-${reply.sender}`}>
                                                <div style={{ fontSize: '0.75rem', opacity: 0.6, marginBottom: '4px' }}>
                                                    {reply.sender === 'admin' ? 'Administrator' : selectedComplaint.complainant} • {reply.timestamp}
                                                </div>
                                                {reply.text}
                                            </div>
                                        ))
                                    ) : (
                                        <p style={{ textAlign: 'center', opacity: 0.4, padding: '1rem' }}>No previous communication.</p>
                                    )}
                                </div>

                                <form className="reply-form" onSubmit={handleSendReply} style={{ marginTop: '1rem' }}>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <textarea
                                            className="form-textarea"
                                            style={{ flexGrow: 1, minHeight: '80px' }}
                                            placeholder="Write your response here..."
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                        ></textarea>
                                        <Button type="submit" variant="primary" icon={<Send size={18} />} />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isAddModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content glass-card fade-in" style={{ maxWidth: '600px' }}>
                        <div className="modal-header">
                            <h3>Add New Complaint</h3>
                            <Button variant="ghost" className="close-btn" onClick={() => setIsAddModalOpen(false)} icon={<X size={24} />} />
                        </div>

                        <form onSubmit={handleAddComplaint}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.5rem 0' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                                        Complainant Name <span style={{ color: '#ff6b6b' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter complainant name"
                                        value={newComplaint.complainant}
                                        onChange={(e) => setNewComplaint({ ...newComplaint, complainant: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                                        Employee ID <span style={{ color: '#ff6b6b' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter employee ID (e.g., EMP001)"
                                        value={newComplaint.employeeId}
                                        onChange={(e) => setNewComplaint({ ...newComplaint, employeeId: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                                        Subject <span style={{ color: '#ff6b6b' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter complaint subject"
                                        value={newComplaint.subject}
                                        onChange={(e) => setNewComplaint({ ...newComplaint, subject: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                                        Description <span style={{ color: '#ff6b6b' }}>*</span>
                                    </label>
                                    <textarea
                                        className="form-textarea"
                                        style={{ minHeight: '120px' }}
                                        placeholder="Describe the complaint in detail..."
                                        value={newComplaint.description}
                                        onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })}
                                    ></textarea>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => setIsAddModalOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" variant="primary" icon={<Plus size={18} />}>
                                        Add Complaint
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ComplaintsPage;
