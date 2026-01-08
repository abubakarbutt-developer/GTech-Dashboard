import {
    Layout,
    Type,
    Palette,
    Moon,
    Sun,
    Monitor,
    Check,
    Settings
} from 'lucide-react';
import { useState, useEffect } from 'react';
import './SettingsPage.css';

interface SettingsPageProps {
    currentTheme: 'light' | 'dark';
    onThemeToggle: () => void;
}

const SettingsPage = ({ currentTheme, onThemeToggle }: SettingsPageProps) => {
    const [layout, setLayout] = useState(() => localStorage.getItem('layout') || 'standard');
    const [fontSize, setFontSize] = useState(() => localStorage.getItem('font-size') || 'medium');

    useEffect(() => {
        localStorage.setItem('layout', layout);
        document.documentElement.setAttribute('data-layout', layout);
    }, [layout]);

    useEffect(() => {
        localStorage.setItem('font-size', fontSize);
        document.documentElement.setAttribute('data-font-size', fontSize);
    }, [fontSize]);

    const layouts = [
        { id: 'compact', name: 'Compact', desc: 'Maximizes content visibility' },
        { id: 'standard', name: 'Standard', desc: 'Balanced spacing and focus' },
        { id: 'wide', name: 'Wide', desc: 'Ultra-wide canvas for big screens' }
    ];

    const fontSizes = [
        { id: 'small', name: 'Small', size: '14px' },
        { id: 'medium', name: 'Medium', size: '16px' },
        { id: 'large', name: 'Large', size: '18px' }
    ];

    return (
        <div className="settings-page fade-in">
            <div className="page-header">
                <div className="header-icon-box">
                    <Settings size={28} />
                </div>
                <div className="header-text">
                    <h1>System <span className="gradient-text">Settings</span></h1>
                    <p>Personalize your dashboard experience and preferences</p>
                </div>
            </div>

            <div className="settings-grid">
                {/* Theme Settings */}
                <section className="settings-card glass-card">
                    <div className="card-header">
                        <div className="icon-bg">
                            <Palette size={20} />
                        </div>
                        <div className="header-text">
                            <h3>Display Theme</h3>
                            <p>Switch between light and dark modes</p>
                        </div>
                    </div>
                    <div className="theme-switcher">
                        <div className={`theme-track glass-card ${currentTheme}`}>
                            <button
                                className={`theme-btn ${currentTheme === 'light' ? 'active' : ''}`}
                                onClick={() => currentTheme !== 'light' && onThemeToggle()}
                            >
                                <Sun size={18} />
                                Light
                            </button>
                            <button
                                className={`theme-btn ${currentTheme === 'dark' ? 'active' : ''}`}
                                onClick={() => currentTheme !== 'dark' && onThemeToggle()}
                            >
                                <Moon size={18} />
                                Dark
                            </button>
                        </div>
                    </div>
                </section>

                {/* Layout Settings */}
                <section className="settings-card glass-card wide-card">
                    <div className="card-header">
                        <div className="icon-bg">
                            <Layout size={20} />
                        </div>
                        <div className="header-text">
                            <h3>Interface Layout</h3>
                            <p>Select a structure that fits your workflow</p>
                        </div>
                    </div>
                    <div className="layout-grid">
                        {layouts.map((l) => (
                            <button
                                key={l.id}
                                className={`layout-option glass-card ${layout === l.id ? 'active' : ''}`}
                                onClick={() => setLayout(l.id)}
                            >
                                <div className={`layout-preview ${l.id}`}>
                                    <div className="preview-sidebar"></div>
                                    <div className="preview-content">
                                        <div className="preview-item"></div>
                                        <div className="preview-item"></div>
                                    </div>
                                </div>
                                <div className="layout-info">
                                    <span className="layout-name">{l.name}</span>
                                    <span className="layout-desc">{l.desc}</span>
                                </div>
                                {layout === l.id && <div className="active-dot"></div>}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Typography Settings */}
                <section className="settings-card glass-card">
                    <div className="card-header">
                        <div className="icon-bg">
                            <Type size={20} />
                        </div>
                        <div className="header-text">
                            <h3>Font Customization</h3>
                            <p>Adjust text size for better readability</p>
                        </div>
                    </div>
                    <div className="font-options">
                        {fontSizes.map((f) => (
                            <button
                                key={f.id}
                                className={`font-btn glass-card ${fontSize === f.id ? 'active' : ''}`}
                                onClick={() => setFontSize(f.id)}
                            >
                                <span className="font-label" style={{ fontSize: f.size }}>Aa</span>
                                <span className="font-name">{f.name}</span>
                                {fontSize === f.id && <Check size={16} className="check-icon" />}
                            </button>
                        ))}
                    </div>
                </section>

                {/* System Settings */}
                <section className="settings-card glass-card">
                    <div className="card-header">
                        <div className="icon-bg">
                            <Monitor size={20} />
                        </div>
                        <div className="header-text">
                            <h3>Advanced Settings</h3>
                            <p>System-wide configurations and updates</p>
                        </div>
                    </div>
                    <div className="advanced-actions">
                        <button className="btn-secondary glass-card">Check for Updates</button>
                        <button className="btn-secondary glass-card">Reset Preferences</button>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default SettingsPage;
