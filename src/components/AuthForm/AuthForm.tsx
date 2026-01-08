import { useState, useEffect } from 'react';
import { Eye, EyeOff, LogIn, Sun, Moon } from 'lucide-react';
import logo from '../../assets/logo.png';
import Button from '../UI/Button';
import './AuthForm.css';

interface AuthFormProps {
    onLogin: (email: string, password: string) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onLogin }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        return (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = (e: React.MouseEvent) => {
        e.preventDefault();
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.email && formData.password) {
            onLogin(formData.email, formData.password);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="auth-page">
            <div className="auth-split-layout">
                {/* Left Side: Branding/Visuals */}
                <div className="auth-branding-side">
                    <div className="branding-content">
                        <div className="branding-logo">
                            <img src={logo} alt="Gtech Sources" className="logo-img-auth" />
                            <span>Gtech Sources</span>
                            <Button variant="ghost" className="theme-toggle-auth glass-card" onClick={toggleTheme} title="Toggle Theme" size="sm">
                                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                            </Button>
                        </div>

                        <div className="branding-hero-text">
                            <h2 className="fade-in">The next generation of <span className="highlight">data intelligence.</span></h2>
                            <p className="fade-in-delay">Join 10,000+ teams who scale their business with our real-time analytics engine.</p>
                        </div>


                    </div>

                    <div className="branding-bg-elements">
                        <div className="floating-mesh"></div>
                        <div className="glow-orb"></div>
                    </div>
                </div>

                {/* Right Side: Authentication Form */}
                <div className="auth-form-side">
                    <div className="auth-card-container">
                        <div className="auth-card glass-card">
                            <div className="auth-header">
                                <h1 className="auth-title">
                                    Welcome Back
                                </h1>
                                <p className="auth-subtitle">
                                    Enter your credentials to access your account
                                </p>
                            </div>

                            <form className="auth-form" onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className="form-label">Email Address</label>
                                    <div className="input-wrapper">
                                        <input
                                            type="email"
                                            name="email"
                                            className="form-input"
                                            placeholder="name@company.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Password</label>
                                    <div className="input-wrapper">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            className="form-input"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="form-options" style={{ justifyContent: 'flex-end' }}>
                                    <a href="#" className="forgot-link">Forgot password?</a>
                                </div>

                                <Button type="submit" variant="primary" fullWidth size="lg" icon={<LogIn size={18} />}>
                                    Sign In
                                </Button>
                            </form>
                        </div>

                        <p className="legal-text">
                            By continuing, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;
