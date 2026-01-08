import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    UserCircle,
    CreditCard,
    Phone,
    Briefcase,
    Building2,
    Calendar,
    DollarSign,
    Save,
    XCircle,
    ShieldCheck,
    Upload,
    Camera,
    File,
    FileText,
    GraduationCap,
    Eye,
    AlertCircle,
    Maximize2,
    Download
} from 'lucide-react';
import { useRef } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import initialEmployeesData from '../../api/employees.json';
import Button from '../../components/UI/Button';
import './EmployeeFormPage.css';

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

const EmployeeFormPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [employees, setEmployees] = useLocalStorage<EmployeeData[]>('employees-data', initialEmployees);
    const [allDocuments, setAllDocuments] = useLocalStorage<Record<number, EmployeeDocuments>>('employee-documents', {});

    const isEditing = !!id;
    const initialDocs = isEditing ? allDocuments[Number(id)] || {
        passportPic: null,
        cnicPdf: null,
        prevSalarySlip: null,
        intermediateDegree: null,
        bachelorsDegree: null
    } : {
        passportPic: null,
        cnicPdf: null,
        prevSalarySlip: null,
        intermediateDegree: null,
        bachelorsDegree: null
    };

    const [formData, setFormData] = useState<Omit<EmployeeData, 'id'>>({
        name: '',
        cnic: '',
        contact: '',
        designation: '',
        startedDate: '',
        status: 'active',
        department: '',
        salary: ''
    });

    const [localDocuments, setLocalDocuments] = useState<EmployeeDocuments>(initialDocs);
    const [previews, setPreviews] = useState<Partial<Record<keyof EmployeeDocuments, string>>>({});
    const [activePreview, setActivePreview] = useState<{ name: string; type: string; url: string | null } | null>(null);
    const [isUploading, setIsUploading] = useState<string | null>(null);

    const fileInputRefs = {
        passportPic: useRef<HTMLInputElement>(null),
        cnicPdf: useRef<HTMLInputElement>(null),
        prevSalarySlip: useRef<HTMLInputElement>(null),
        intermediateDegree: useRef<HTMLInputElement>(null),
        bachelorsDegree: useRef<HTMLInputElement>(null)
    };

    useEffect(() => {
        if (isEditing) {
            const employee = employees.find(emp => emp.id === Number(id));
            if (employee) {
                setFormData({
                    name: employee.name,
                    cnic: employee.cnic,
                    contact: employee.contact,
                    designation: employee.designation,
                    startedDate: employee.startedDate,
                    status: employee.status,
                    department: employee.department,
                    salary: employee.salary
                });
            }
        }
    }, [id, isEditing, employees]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileUpload = (type: keyof EmployeeDocuments) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsUploading(type);
            const previewUrl = URL.createObjectURL(file);
            setPreviews(prev => ({ ...prev, [type]: previewUrl }));

            setTimeout(() => {
                setLocalDocuments(prev => ({
                    ...prev,
                    [type]: file.name
                }));
                setIsUploading(null);
            }, 800);
        }
    };

    const openPreview = (type: keyof EmployeeDocuments, title: string) => {
        const url = previews[type];
        setActivePreview({
            name: title,
            type: localDocuments[type]?.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image',
            url: url || null
        });
    };

    const renderUploadCard = (type: keyof EmployeeDocuments, title: string, subtitle: string, icon: any) => {
        const Icon = icon;
        const isFileUploaded = !!localDocuments[type];
        const uploading = isUploading === type;

        return (
            <div className="upload-card">
                <div className={`upload-icon-wrapper ${type.includes('Degree') ? 'edu' : ''}`}>
                    <Icon size={24} />
                </div>
                <div className="upload-info">
                    <span className="upload-title">{title}</span>
                    <small>{subtitle}</small>
                </div>

                {isFileUploaded ? (
                    <div className="uploaded-actions">
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            className="action-btn-mini view"
                            onClick={() => openPreview(type, title)}
                            icon={<Eye size={16} />}
                        >
                            See
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            className="action-btn-mini download"
                            onClick={() => {
                                const url = previews[type];
                                if (url) {
                                    const link = document.createElement('a');
                                    link.href = url;
                                    link.download = localDocuments[type] || 'document';
                                    link.click();
                                }
                            }}
                            disabled={!previews[type]}
                            icon={<Download size={16} />}
                        >
                            Download
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="change-file-link"
                            onClick={() => fileInputRefs[type].current?.click()}
                        >
                            Change File
                        </Button>
                    </div>
                ) : (
                    <div className="not-uploaded-status">
                        <Button
                            type="button"
                            variant="secondary"
                            className="upload-btn"
                            onClick={() => fileInputRefs[type].current?.click()}
                            isLoading={uploading}
                            icon={!uploading && <Upload size={16} />}
                        >
                            {uploading ? 'Uploading...' : 'Upload'}
                        </Button>
                    </div>
                )}

                <input
                    type="file"
                    ref={fileInputRefs[type]}
                    hidden
                    onChange={handleFileUpload(type)}
                    accept={type === 'cnicPdf' ? '.pdf' : 'image/*,.pdf'}
                />
                {isFileUploaded && <span className="file-name">{localDocuments[type]}</span>}
            </div>
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing) {
            const empId = Number(id);
            setEmployees(prev => prev.map(emp =>
                emp.id === empId ? { ...emp, ...formData } : emp
            ));
            setAllDocuments(prev => ({ ...prev, [empId]: localDocuments }));
        } else {
            const newId = Math.max(0, ...employees.map(e => e.id)) + 1;
            const newEmployee: EmployeeData = {
                id: newId,
                ...formData
            };
            setEmployees(prev => [newEmployee, ...prev]);
            setAllDocuments(prev => ({ ...prev, [newId]: localDocuments }));
        }

        navigate('/employees');
    };

    return (
        <div className="employee-form-page fade-in">
            <div className="form-header">
                <Button variant="secondary" onClick={() => navigate('/employees')} icon={<ArrowLeft size={18} />}>
                    Back to List
                </Button>
                <div className="header-text">
                    <h1>{isEditing ? 'Edit' : 'Add New'} <span className="gradient-text">Employee</span></h1>
                    <p>{isEditing ? `Updating information for ${formData.name}` : 'Fill in the details to onboard a new employee'}</p>
                </div>
            </div>

            <div className="form-container glass-card">
                <form onSubmit={handleSubmit} className="employee-details-form">
                    <div className="form-section-title">
                        <UserCircle size={20} />
                        <h3>Identity & Contact</h3>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label><UserCircle size={16} /> Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter full name"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label><CreditCard size={16} /> CNIC No</label>
                            <input
                                type="text"
                                name="cnic"
                                value={formData.cnic}
                                onChange={handleInputChange}
                                placeholder="42101-XXXXXXX-X"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label><Phone size={16} /> Contact No</label>
                            <input
                                type="text"
                                name="contact"
                                value={formData.contact}
                                onChange={handleInputChange}
                                placeholder="+92 XXX XXXXXXX"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-section-title mt-2">
                        <Briefcase size={20} />
                        <h3>Professional Details</h3>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label><Briefcase size={16} /> Designation</label>
                            <input
                                type="text"
                                name="designation"
                                value={formData.designation}
                                onChange={handleInputChange}
                                placeholder="e.g. Senior Software Engineer"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label><Building2 size={16} /> Department</label>
                            <input
                                type="text"
                                name="department"
                                value={formData.department}
                                onChange={handleInputChange}
                                placeholder="e.g. Engineering"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label><Calendar size={16} /> Started Date</label>
                            <input
                                type="date"
                                name="startedDate"
                                value={formData.startedDate}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label><DollarSign size={16} /> Monthly Salary (Rs.)</label>
                            <input
                                type="text"
                                name="salary"
                                value={formData.salary}
                                onChange={handleInputChange}
                                placeholder="e.g. 100,000"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label><ShieldCheck size={16} /> Employment Status</label>
                            <select name="status" value={formData.status} onChange={handleInputChange}>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-section-title mt-2">
                        <Upload size={20} />
                        <h3>Employee Documents</h3>
                    </div>

                    <div className="upload-grid">
                        {renderUploadCard('passportPic', 'Passport Size Pic', 'JPG or PNG, max 2MB', Camera)}
                        {renderUploadCard('cnicPdf', 'CNIC Copy', 'PDF format only', File)}
                        {renderUploadCard('prevSalarySlip', 'Ex-Company Salary Slip', 'PDF, JPG or PNG', DollarSign)}
                    </div>

                    <div className="education-upload-section">
                        <h4 className="sub-section-title"><GraduationCap size={18} /> Education Degrees</h4>
                        <div className="upload-grid">
                            {renderUploadCard('intermediateDegree', 'Intermediate Degree', 'PDF, JPG or PNG', FileText)}
                            {renderUploadCard('bachelorsDegree', 'Bachelors Degree', 'PDF, JPG or PNG', FileText)}
                        </div>
                    </div>

                    <div className="form-footer">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => navigate('/employees')}
                            icon={<XCircle size={18} />}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            icon={<Save size={18} />}
                        >
                            {isEditing ? 'Update Employee' : 'Save Employee'}
                        </Button>
                    </div>
                </form>
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
                                <XCircle size={24} />
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
                                    <p>File content is not available for preview in this session.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeFormPage;
