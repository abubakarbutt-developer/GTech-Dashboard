import {
    Users,
    Calendar,
    Clock,
    Settings,
    ChevronLeft,
    ChevronRight,
    BarChart3,
    UserCircle,
    Shield,
    LayoutDashboard,
    PartyPopper,
    MessageSquareWarning,
    FileText
} from 'lucide-react';
import { useState } from 'react';
import logo from '../../assets/main_logo.png';
import './Sidebar.css';

interface SidebarProps {
    onNavigate?: (page: string) => void;
    activePage?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, activePage = 'analytics' }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const menuGroups = [
        {
            title: 'Overview',
            items: [
                { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                { id: 'departments', label: 'Departments', icon: LayoutDashboard },
            ]
        },
        {
            title: 'Staff',
            items: [
                { id: 'employees', label: 'Employees', icon: Users },
                { id: 'attendance', label: 'Attendance', icon: Calendar },
                { id: 'applications', label: 'Applications', icon: FileText },
            ]
        },
        {
            title: 'Management',
            items: [
                { id: 'calendars', label: 'Calendars', icon: Calendar },
                { id: 'events', label: 'Events', icon: PartyPopper },
                { id: 'complaints', label: 'Complaints', icon: MessageSquareWarning },
                { id: 'schedules', label: 'Schedules', icon: Clock },
            ]
        },
        {
            title: 'System',
            items: [
                { id: 'settings', label: 'Settings', icon: Settings },
                { id: 'admin', label: 'Admin Panel', icon: Shield },
            ]
        }
    ];

    return (
        <aside className={`sidebar glass-card ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <div className="sidebar-logo-container">
                    <div className="logo-box-small">
                        <img src={logo} alt="Gtech Sources" className="logo-img" />
                    </div>
                    {!isCollapsed && (
                        <div className="sidebar-title-text fade-in">
                            <span className="brand-name">Gtech</span>
                            <span className="brand-suffix gradient-text">Sources</span>
                        </div>
                    )}
                </div>
                <button
                    className="collapse-btn"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    title={isCollapsed ? "Expand" : "Collapse"}
                >
                    {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
            </div>

            <div className="sidebar-content">
                {menuGroups.map((group, groupIdx) => (
                    <div key={groupIdx} className="menu-group">
                        {!isCollapsed && <h4 className="group-title fade-in">{group.title}</h4>}
                        <nav className="menu-nav">
                            {group.items.map((item) => {
                                const Icon = item.icon;
                                const isActive = activePage === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        className={`menu-item ${isActive ? 'active' : ''}`}
                                        onClick={() => onNavigate?.(item.id)}
                                        title={isCollapsed ? item.label : ''}
                                    >
                                        <Icon className="menu-icon" size={20} />
                                        {!isCollapsed && <span className="menu-label fade-in">{item.label}</span>}
                                        {isActive && <div className="active-indicator"></div>}
                                    </button>
                                );
                            })}
                        </nav>
                        {groupIdx < menuGroups.length - 1 && <div className="group-divider"></div>}
                    </div>
                ))}
            </div>

            <div className="sidebar-footer">
                <div className="sidebar-profile">
                    <UserCircle size={isCollapsed ? 24 : 32} className="footer-profile-icon" />
                    {!isCollapsed && (
                        <div className="profile-meta fade-in">
                            <span className="profile-role">Administrator</span>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
