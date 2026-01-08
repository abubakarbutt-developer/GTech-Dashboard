import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import Header from '../components/Header/Header';

interface DashboardLayoutProps {
    userEmail: string;
    userAvatar: string;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    handleLogout: () => void;
    handleAvatarChange: (newImage: string) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
    userEmail,
    userAvatar,
    theme,
    toggleTheme,
    handleLogout,
    handleAvatarChange,
}) => {
    const location = useLocation();
    const navigate = useNavigate();
    const activePage = location.pathname.split('/')[1] || 'analytics';

    const handleNavigate = (page: string) => {
        navigate(`/${page}`);
    };

    return (
        <div className="dashboard-layout">
            <Sidebar activePage={activePage} onNavigate={handleNavigate} />

            <div className="app-container">
                <div className="app">
                    <Header
                        userEmail={userEmail}
                        userAvatar={userAvatar}
                        theme={theme}
                        toggleTheme={toggleTheme}
                        handleLogout={handleLogout}
                        handleAvatarChange={handleAvatarChange}
                    />

                    <main className="main-content">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
