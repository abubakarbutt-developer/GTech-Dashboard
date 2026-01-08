import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AnalyticsPage from '../pages/Analytics/AnalyticsPage';
import EmployeesPage from '../pages/Employees/EmployeesPage';
import EmployeeDetailsPage from '../pages/Employees/EmployeeDetailsPage';
import EmployeeFormPage from '../pages/Employees/EmployeeFormPage';
import AttendancePage from '../pages/Attendance/AttendancePage';
import AdminPage from '../pages/Admin/AdminPage';
import DepartmentsSection from '../pages/Departments/DepartmentsSection';
import FacilitiesPage from '../pages/Facilities/FacilitiesPage';
import SettingsPage from '../pages/Settings/SettingsPage';
import CalendarPage from '../pages/Calendar/CalendarPage';
import EventsPage from '../pages/Events/EventsPage';
import ComplaintsPage from '../pages/Complaints/ComplaintsPage';
import ApplicationCenter from '../pages/Applications/ApplicationCenter';
import { BarChart3 } from 'lucide-react';

interface AppRoutesProps {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

const AppRoutes: React.FC<AppRoutesProps> = ({ theme, toggleTheme }) => {
    const navigate = useNavigate();
    const handleNavigate = (page: string) => navigate(`/${page}`);

    return (
        <Routes>
            <Route path="/" element={<Navigate to="/analytics" replace />} />
            <Route path="/analytics" element={<AnalyticsPage handleNavigate={handleNavigate} />} />
            <Route path="/employees" element={<EmployeesPage />} />
            <Route path="/employees/new" element={<EmployeeFormPage />} />
            <Route path="/employees/edit/:id" element={<EmployeeFormPage />} />
            <Route path="/employees/:id" element={<EmployeeDetailsPage />} />
            <Route path="/departments" element={<DepartmentsSection onNavigate={handleNavigate} />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/facilities" element={<FacilitiesPage onBack={() => handleNavigate('analytics')} />} />
            <Route path="/settings" element={<SettingsPage currentTheme={theme} onThemeToggle={toggleTheme} />} />
            <Route path="/calendars" element={<CalendarPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/complaints" element={<ComplaintsPage />} />
            <Route path="/applications" element={<ApplicationCenter />} />

            <Route path="*" element={
                <div className="placeholder-view glass-card fade-in">
                    <div className="placeholder-icon">
                        <BarChart3 size={48} />
                    </div>
                    <h2>Page Not Found</h2>
                    <p>This section is currently under development. Stay tuned!</p>
                    <button className="btn-primary" onClick={() => handleNavigate('analytics')}>
                        Back to Dashboard
                    </button>
                </div>
            } />
        </Routes>
    );
};

export default AppRoutes;
