import React from 'react';
import Avatar from '../Avatar/Avatar';
import { LogOut, Sun, Moon } from 'lucide-react';
import logo from '../../assets/main_logo.png';

interface HeaderProps {
    userEmail: string;
    userAvatar: string;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    handleLogout: () => void;
    handleAvatarChange: (newImage: string) => void;
}

const Header: React.FC<HeaderProps> = ({
    userEmail,
    userAvatar,
    theme,
    toggleTheme,
    handleLogout,
    handleAvatarChange,
}) => {
    return (
        <header className="header">
            <div className="header-content">
                <div className="branding-box">
                    <div className="logo-box">
                        <img src={logo} alt="Gtech Sources" className="branding-logo-img" />
                    </div>
                    <div className="branding-content">
                        <h1 className="branding-title">
                            Gtech <span className="gradient-text">Sources</span>
                        </h1>
                        <p className="branding-subtitle">Innovating new Possibilties</p>
                    </div>
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
                        <button className="btn-logout" onClick={handleLogout}>
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
