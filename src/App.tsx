import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import useLocalStorage from './hooks/useLocalStorage';
import {
  TrendingUp,
  Zap,
  Droplets,
  Briefcase,
  Wifi,
  LogOut,
  BarChart3,
  Clock,
  UserCheck,
  UserX,
  Timer,
  Sun,
  Moon
} from 'lucide-react';
import StatCard from './components/StatCard/StatCard';
import ChartCard from './components/ChartCard/ChartCard';
import BudgetChart from './components/BudgetChart/BudgetChart';
import ActivityFeed from './components/ActivityFeed/ActivityFeed';
import AuthForm from './components/AuthForm/AuthForm';
import Avatar from './components/Avatar/Avatar';
import Sidebar from './components/Sidebar/Sidebar';
import EmployeesPage from './pages/Employees/EmployeesPage';
import EmployeeDetailsPage from './pages/Employees/EmployeeDetailsPage';
import EmployeeFormPage from './pages/Employees/EmployeeFormPage';
import AttendancePage from './pages/Attendance/AttendancePage';
import AdminPage from './pages/Admin/AdminPage';
import DepartmentsSection from './pages/Departments/DepartmentsSection';
import FacilitiesPage from './pages/Facilities/FacilitiesPage';
import SettingsPage from './pages/Settings/SettingsPage';
import CalendarPage from './pages/Calendar/CalendarPage';
import EventsPage from './pages/Events/EventsPage';
import ComplaintsPage from './pages/Complaints/ComplaintsPage';
import ApplicationCenter from './pages/Applications/ApplicationCenter';
import dashboardData from './api/dashboardData.json';
import initialAttendance from './api/attendance.json';
import './App.css';
import './PlaceholderViews.css';

// Sample data for charts
const { expenseData, monthlyBudgetData, activities: rawActivities } = dashboardData;

const iconMap: Record<string, any> = { Zap, Wifi, Droplets, Briefcase, Clock };
const activities = rawActivities.map(a => ({
  ...a,
  icon: iconMap[a.icon as keyof typeof iconMap] || Clock
}));


function App() {
  const [isAuthenticated, setIsAuthenticated] = useLocalStorage('is-authenticated', false);
  const [userEmail, setUserEmail] = useLocalStorage('user-email', '');
  const [userAvatar, setUserAvatar] = useLocalStorage('user-avatar', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80');

  const navigate = useNavigate();
  const location = useLocation();

  // Sync activePage with URL
  const activePage = location.pathname.split('/')[1] || 'analytics';

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLogin = (email: string, _password: string) => {
    setUserEmail(email);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserEmail('');
  };

  const handleAvatarChange = (newImage: string) => {
    setUserAvatar(newImage);
  };

  const handleNavigate = (page: string) => {
    navigate(`/${page}`);
  };

  if (!isAuthenticated) {
    return <AuthForm onLogin={handleLogin} />;
  }

  return (
    <div className="dashboard-layout">
      <Sidebar activePage={activePage} onNavigate={handleNavigate} />

      <div className="app-container">
        <div className="app">
          <header className="header slide-in">
            <div className="header-content">
              <div>
                <h1 className="header-title">
                  Gtech <span className="gradient-text">Sources</span>
                </h1>
                <p className="header-subtitle">Managing your {activePage} overview.</p>
              </div>
              <div className="header-right">
                <div className="profile-info">
                  <Avatar
                    email={userEmail}
                    size="medium"
                    src={userAvatar}
                    editable={true}
                    onImageChange={handleAvatarChange}
                  />
                  <div className="profile-details">
                    <span className="profile-name">{userEmail.split('@')[0]}</span>
                    <span className="profile-email">{userEmail}</span>
                  </div>
                </div>
                <div className="header-actions">
                  <button className="theme-toggle glass-card" onClick={toggleTheme} title="Toggle Theme">
                    {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                  </button>
                  <button className="btn-primary">
                    <TrendingUp size={18} />
                    Generate Report
                  </button>
                  <button className="btn-logout" onClick={handleLogout}>
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </header>

          <main className="main-content">
            <Routes>
              <Route path="/" element={<Navigate to="/analytics" replace />} />
              <Route path="/analytics" element={
                <>
                  <section className="stats-grid">
                    <StatCard
                      title="Electricity Bills"
                      value="Rs. 24,500"
                      change={8.5}
                      icon={Zap}
                      gradient="linear-gradient(135deg, #f6d365 0%, #fda085 100%)"
                    />
                    <StatCard
                      title="Water Bills"
                      value="Rs. 4,200"
                      change={-12.2}
                      icon={Droplets}
                      gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
                    />
                    <StatCard
                      title="Office Expenses"
                      value="Rs. 18,750"
                      change={5.3}
                      icon={Briefcase}
                      gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    />
                    <StatCard
                      title="Internet Bills"
                      value="Rs. 6,800"
                      change={0}
                      icon={Wifi}
                      gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                    />
                  </section>

                  <h3 className="section-title">Attendance <span className="gradient-text">Overview</span></h3>
                  <section className="stats-grid">
                    <StatCard
                      title="Today Active Employees"
                      value={(() => {
                        const attendance = JSON.parse(localStorage.getItem('attendance-data') || JSON.stringify(initialAttendance));
                        return attendance.filter((a: any) => a.date === '2026-01-06' && (a.status === 'present' || a.status === 'late')).length;
                      })()}
                      change={5}
                      icon={UserCheck}
                      gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)"
                    />
                    <StatCard
                      title="Today Leave"
                      value={(() => {
                        const attendance = JSON.parse(localStorage.getItem('attendance-data') || JSON.stringify(initialAttendance));
                        return attendance.filter((a: any) => a.date === '2026-01-06' && a.status === 'absent').length;
                      })()}
                      change={-2}
                      icon={UserX}
                      gradient="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
                    />
                    <StatCard
                      title="Today Short Leave"
                      value={(() => {
                        const attendance = JSON.parse(localStorage.getItem('attendance-data') || JSON.stringify(initialAttendance));
                        return attendance.filter((a: any) => a.date === '2026-01-06' && a.status === 'half-day').length;
                      })()}
                      change={1}
                      icon={Timer}
                      gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                    />
                  </section>

                  <section className="charts-grid">
                    <div className="chart-wrapper">
                      <ChartCard
                        title="Monthly Expenses"
                        data={expenseData}
                        dataKey="value"
                        gradient={['#f6d365', '#fda085']}
                      />
                    </div>
                    <div className="chart-wrapper">
                      <BudgetChart
                        title="Monthly Budget Utilization"
                        data={monthlyBudgetData}
                      />
                    </div>
                  </section>

                  <DepartmentsSection onNavigate={handleNavigate} />

                  <section className="activity-section">
                    <ActivityFeed activities={activities} />
                  </section>
                </>
              } />

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
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
