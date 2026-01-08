import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    UserCheck,
    CalendarCheck,
    FileText,
    Download,
    Clock,
    Briefcase,
    Building2,
    Calendar,
    Phone,
    CreditCard,
    DollarSign,
    Camera,
    File,
    GraduationCap,
    Eye,
    AlertCircle,
    X,
    Maximize2
} from 'lucide-react';
import { useState } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import initialEmployeesData from '../../api/employees.json';
import Button from '../../components/UI/Button';
import './EmployeeDetailsPage.css';

interface EmployeeData {
    id: number;
    name: string;
    cnic: string;
    contact: string;
    designation: string;
    startedDate: string;
    status: 'active' | 'inactive';
    department: string;
    salary: string;
}

interface EmployeeDocuments {
    passportPic: string | null;
    cnicPdf: string | null;
    prevSalarySlip: string | null;
    intermediateDegree: string | null;
    bachelorsDegree: string | null;
}

const initialEmployees = initialEmployeesData as EmployeeData[];

const EmployeeDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [employees] = useLocalStorage<EmployeeData[]>('employees-data', initialEmployees);
    const [allDocuments] = useLocalStorage<Record<number, EmployeeDocuments>>('employee-documents', {});

    const employee = employees.find(emp => emp.id === Number(id));
    const savedDocuments = id ? allDocuments[Number(id)] : null;

    const [activePreview, setActivePreview] = useState<{ name: string; type: string; url: string | null } | null>(null);

    if (!employee) {
        return (
            <div className="employee-details-page fade-in">
                <div className="glass-card error-card">
                    <h2>Employee Not Found</h2>
                    <p>The employee you are looking for does not exist or has been removed.</p>
                    <Button variant="primary" onClick={() => navigate('/employees')} icon={<ArrowLeft size={18} />}>
                        Back to Employees
                    </Button>
                </div>
            </div>
        );
    }

    const openPreview = (type: keyof EmployeeDocuments, title: string) => {
        // In a real app, this would be a URL to the stored file.
        // For this demo, we can't show "real" previews for persistent files 
        // because object URLs are session-based.
        setActivePreview({
            name: title,
            type: savedDocuments?.[type]?.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image',
            url: null // Would be file URL from server
        });
    };

    const getEmployeeLeaveData = (employeeId: number) => {
        const seed = employeeId * 123;
        return {
            casualLeave: { total: 12, used: (seed % 5) + 2, remaining: 12 - ((seed % 5) + 2) },
            sickLeave: { total: 10, used: (seed % 3) + 1, remaining: 10 - ((seed % 3) + 1) },
            shortLeave: { total: 6, used: (seed % 2) + 1, remaining: 6 - ((seed % 2) + 1) },
            annualLeave: { total: 20, used: (seed % 8) + 4, remaining: 20 - ((seed % 8) + 4) }
        };
    };

    const leaveData = getEmployeeLeaveData(employee.id);

    const downloadFile = (content: string, filename: string) => {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    };

    const generateSalarySlip = () => {
        const month = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        const content = `SALARY SLIP - ${month}\nName: ${employee.name}\nNet Salary: Rs. ${employee.salary}`;
        downloadFile(content, `Salary_Slip_${employee.name.replace(/\s+/g, '_')}.txt`);
    };

    const generateAttendanceReport = () => {
        const content = `DAILY ACTIVITY REPORT\nEmployee: ${employee.name}\nDepartment: ${employee.department}`;
        downloadFile(content, `Activity_Report_${employee.name.replace(/\s+/g, '_')}.txt`);
    };

    const generateLeaveReport = () => {
        const content = `LEAVE REPORT\nEmployee: ${employee.name}\nRemaining: ${leaveData.casualLeave.remaining} Casual, ${leaveData.sickLeave.remaining} Sick`;
        downloadFile(content, `Leave_Report_${employee.name.replace(/\s+/g, '_')}.txt`);
    };

    const renderDocumentCard = (type: keyof EmployeeDocuments, title: string, subtitle: string, icon: any) => {
        const Icon = icon;
        const documentName = savedDocuments?.[type];
        const isFileUploaded = !!documentName;

        return (
            <div className="upload-card view-only">
                <div className={`upload-icon-wrapper ${type.includes('Degree') ? 'edu' : ''}`}>
                    <Icon size={24} />
                </div>
                <div className="upload-info">
                    <span className="upload-title">{title}</span>
                    {isFileUploaded ? (
                        <span className="file-name-info">{documentName}</span>
                    ) : (
                        <small>{subtitle}</small>
                    )}
                </div>

                {isFileUploaded ? (
                    <div className="uploaded-actions">
                        <Button
                            variant="secondary"
                            size="sm"
                            className="action-btn-mini view"
                            onClick={() => openPreview(type, title)}
                            icon={<Eye size={16} />}
                        >
                            View
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            className="action-btn-mini download"
                            onClick={() => {
                                const content = `Document Verification\nEmployee: ${employee.name}\nDocument Type: ${title}\nFile Name: ${documentName}`;
                                downloadFile(content, `Document_${title.replace(/\s+/g, '_')}_${employee.name.replace(/\s+/g, '_')}.txt`);
                            }}
                            icon={<Download size={16} />}
                        >
                            Download
                        </Button>
                    </div>
                ) : (
                    <div className="not-uploaded-info">
                        <AlertCircle size={14} />
                        <span>Not Uploaded</span>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="employee-details-page fade-in">
            <div className="details-header">
                <Button variant="secondary" className="back-btn glass-card" onClick={() => navigate('/employees')}>
                    <ArrowLeft size={20} />
                </Button>
                <div className="header-info">
                    <h1>Employee Profile</h1>
                    <p>Detailed view and management for {employee.name}</p>
                </div>
            </div>

            <div className="details-grid">
                <div className="details-main">
                    <div className="glass-card main-info-section">
                        <div className="section-header">
                            <UserCheck size={20} />
                            <h3>Personal Information</h3>
                        </div>
                        <div className="info-grid">
                            <div className="info-item">
                                <label><UserCheck size={14} /> Full Name</label>
                                <span>{employee.name}</span>
                            </div>
                            <div className="info-item">
                                <label><CreditCard size={14} /> Employee ID</label>
                                <span>EMP-{String(employee.id).padStart(4, '0')}</span>
                            </div>
                            <div className="info-item">
                                <label><CreditCard size={14} /> CNIC</label>
                                <span>{employee.cnic}</span>
                            </div>
                            <div className="info-item">
                                <label><Phone size={14} /> Contact</label>
                                <span>{employee.contact}</span>
                            </div>
                            <div className="info-item">
                                <label><Briefcase size={14} /> Designation</label>
                                <span>{employee.designation}</span>
                            </div>
                            <div className="info-item">
                                <label><Building2 size={14} /> Department</label>
                                <span>{employee.department}</span>
                            </div>
                            <div className="info-item">
                                <label><Calendar size={14} /> Started Date</label>
                                <span>{employee.startedDate}</span>
                            </div>
                            <div className="info-item">
                                <label><DollarSign size={14} /> Monthly Salary</label>
                                <span className="salary-value">Rs. {employee.salary}</span>
                            </div>
                            <div className="info-item">
                                <label>Status</label>
                                <span className={`status-badge ${employee.status}`}>
                                    ● {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card documents-view-section">
                        <div className="section-header">
                            <FileText size={20} />
                            <h3>Employee Documents</h3>
                        </div>

                        <div className="upload-grid">
                            {renderDocumentCard('passportPic', 'Passport Size Pic', 'No image uploaded', Camera)}
                            {renderDocumentCard('cnicPdf', 'CNIC Copy', 'No PDF uploaded', File)}
                            {renderDocumentCard('prevSalarySlip', 'Salary Slip', 'No document uploaded', DollarSign)}
                        </div>

                        <div className="education-upload-section">
                            <h4 className="sub-section-title"><GraduationCap size={18} /> Education Degrees</h4>
                            <div className="upload-grid">
                                {renderDocumentCard('intermediateDegree', 'Intermediate Degree', 'Not uploaded', FileText)}
                                {renderDocumentCard('bachelorsDegree', 'Bachelors Degree', 'Not uploaded', FileText)}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="details-sidebar">
                    <div className="glass-card leave-balance-section">
                        <div className="section-header">
                            <CalendarCheck size={20} />
                            <h3>Leave Balance</h3>
                        </div>
                        <div className="leave-grid">
                            {/* Simplified leave display */}
                            <div className="leave-card">
                                <span className="leave-label">Casual</span>
                                <div className="leave-stats">
                                    <span className="remaining">{leaveData.casualLeave.remaining}</span>
                                    <span className="total">/ {leaveData.casualLeave.total} left</span>
                                </div>
                            </div>
                            <div className="leave-card">
                                <span className="leave-label">Sick</span>
                                <div className="leave-stats">
                                    <span className="remaining">{leaveData.sickLeave.remaining}</span>
                                    <span className="total">/ {leaveData.sickLeave.total} left</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card reports-section">
                        <div className="section-header">
                            <FileText size={20} />
                            <h3>Reports</h3>
                        </div>
                        <div className="reports-actions">
                            <Button variant="ghost" className="btn-report" onClick={generateSalarySlip}>
                                <div className="report-icon"><DollarSign size={18} /></div>
                                <div className="report-info"><span>Salary Slip</span></div>
                                <Download size={16} />
                            </Button>
                            <Button variant="ghost" className="btn-report" onClick={generateAttendanceReport}>
                                <div className="report-icon"><Clock size={18} /></div>
                                <div className="report-info"><span>Monthly Activity</span></div>
                                <Download size={16} />
                            </Button>
                            <Button variant="ghost" className="btn-report" onClick={generateLeaveReport}>
                                <div className="report-icon"><CalendarCheck size={18} /></div>
                                <div className="report-info"><span>Leave Report</span></div>
                                <Download size={16} />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Document Preview Modal */}
            {activePreview && (
                <div className="preview-modal-overlay fade-in" onClick={() => setActivePreview(null)}>
                    <div className="preview-modal-container scale-up" onClick={e => e.stopPropagation()}>
                        <div className="preview-modal-header">
                            <div className="header-left">
                                <Maximize2 size={18} />
                                <h3>{activePreview.name} Preview</h3>
                            </div>
                            <Button variant="ghost" className="close-preview" onClick={() => setActivePreview(null)}>
                                <X size={24} />
                            </Button>
                        </div>
                        <div className="preview-content">
                            {activePreview.url ? (
                                activePreview.type === 'pdf' ? (
                                    <iframe src={activePreview.url} title="PDF Preview" className="pdf-frame" />
                                ) : (
                                    <img src={activePreview.url} alt="Document Preview" />
                                )
                            ) : (
                                <div className="no-preview-placeholder">
                                    <AlertCircle size={48} />
                                    <p>File preview is not available in the details view. Please go to "Edit Employee" to upload or update files.</p>
                                </div>
                            )}
                        </div>
                        <div className="preview-modal-footer">
                            <Button variant="primary" size="sm" onClick={() => navigate(`/employees/edit/${employee.id}`)} icon={<ArrowLeft size={16} style={{ transform: 'rotate(180deg)' }} />}>
                                Edit to Upload
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeDetailsPage;
