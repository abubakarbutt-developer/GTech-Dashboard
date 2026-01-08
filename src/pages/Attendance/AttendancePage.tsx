import {
    Calendar as CalendarIcon,
    Search,
    Clock,
    UserCheck,
    UserX,
    AlertCircle,
    Download,
    ChevronLeft,
    ChevronRight,
    MapPin
} from 'lucide-react';
import { useState } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import initialAttendanceData from '../../api/attendance.json';
import './AttendancePage.css';

interface AttendanceData {
    id: number;
    employeeName: string;
    designation: string;
    date: string;
    checkIn: string;
    checkOut: string;
    status: 'present' | 'absent' | 'late' | 'half-day';
    totalHours: string;
}

const initialAttendance = initialAttendanceData as AttendanceData[];


const AttendancePage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [attendance] = useLocalStorage<AttendanceData[]>('attendance-data', initialAttendance);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const filteredAttendance = attendance.filter(item => {
        const matchesSearch = item.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        present: attendance.filter(a => a.status === 'present' || a.status === 'late').length,
        absent: attendance.filter(a => a.status === 'absent').length,
        late: attendance.filter(a => a.status === 'late').length,
        halfDay: attendance.filter(a => a.status === 'half-day').length,
    };

    return (
        <div className="attendance-page fade-in">
            <div className="page-header">
                <div className="header-icon-box">
                    <CalendarIcon size={28} />
                </div>
                <div className="header-text">
                    <h1>Attendance <span className="gradient-text">Logs</span></h1>
                    <p>Track employee presence and working hours in real-time</p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="attendance-stats-grid">
                <div className="attendance-stat-card glass-card">
                    <div className="stat-icon-wrapper present">
                        <UserCheck size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Present Today</span>
                        <span className="stat-value">{stats.present}</span>
                    </div>
                </div>
                <div className="attendance-stat-card glass-card">
                    <div className="stat-icon-wrapper absent">
                        <UserX size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Absent Today</span>
                        <span className="stat-value">{stats.absent}</span>
                    </div>
                </div>
                <div className="attendance-stat-card glass-card">
                    <div className="stat-icon-wrapper late">
                        <Clock size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Late Arrivals</span>
                        <span className="stat-value">{stats.late}</span>
                    </div>
                </div>
                <div className="attendance-stat-card glass-card">
                    <div className="stat-icon-wrapper alert">
                        <AlertCircle size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Half Days</span>
                        <span className="stat-value">{stats.halfDay}</span>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="attendance-controls glass-card">
                <div className="controls-left">
                    <div className="search-wrapper">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search employee..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    <div className="date-picker-wrapper">
                        <CalendarIcon size={18} className="calendar-icon" />
                        <span className="current-date">Jan 06, 2026</span>
                        <div className="date-nav">
                            <button className="nav-btn"><ChevronLeft size={16} /></button>
                            <button className="nav-btn"><ChevronRight size={16} /></button>
                        </div>
                    </div>
                </div>
                <div className="controls-right">
                    <select
                        className="status-select"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                        <option value="late">Late</option>
                        <option value="half-day">Half Day</option>
                    </select>
                    <button className="btn-secondary">
                        <Download size={18} />
                        Export
                    </button>
                </div>
            </div>

            {/* Attendance Table */}
            <div className="attendance-table-container glass-card">
                <table className="attendance-table">
                    <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Date</th>
                            <th>Check In</th>
                            <th>Check Out</th>
                            <th>Status</th>
                            <th>Total Hours</th>
                            <th>Location</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAttendance.map((item) => (
                            <tr key={item.id} className="attendance-row">
                                <td>
                                    <div className="employee-cell">
                                        <div className="employee-avatar-tiny">
                                            {item.employeeName.charAt(0)}
                                        </div>
                                        <div className="employee-info-mini">
                                            <span className="emp-name">{item.employeeName}</span>
                                            <span className="emp-desig">{item.designation}</span>
                                        </div>
                                    </div>
                                </td>
                                <td><span className="date-text">{item.date}</span></td>
                                <td>
                                    <div className="time-cell">
                                        <Clock size={14} className="time-icon" />
                                        {item.checkIn}
                                    </div>
                                </td>
                                <td>
                                    <div className="time-cell">
                                        <Clock size={14} className="time-icon" />
                                        {item.checkOut}
                                    </div>
                                </td>
                                <td>
                                    <span className={`status-pill ${item.status}`}>
                                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                    </span>
                                </td>
                                <td>
                                    <span className="hours-text">{item.totalHours} Hrs</span>
                                </td>
                                <td>
                                    <div className="location-cell">
                                        <MapPin size={14} />
                                        Main Office
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredAttendance.length === 0 && (
                    <div className="empty-results">
                        <CalendarIcon size={48} />
                        <p>No attendance records found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AttendancePage;
