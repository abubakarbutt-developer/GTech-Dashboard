import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import useLocalStorage from './hooks/useLocalStorage';
import AuthForm from './components/AuthForm/AuthForm';
import DashboardLayout from './layouts/DashboardLayout';
import AppRoutes from './routes/AppRoutes';
import './App.css';
import './PlaceholderViews.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useLocalStorage('is-authenticated', false);
  const [userEmail, setUserEmail] = useLocalStorage('user-email', '');
  const [userAvatar, setUserAvatar] = useLocalStorage('user-avatar', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80');

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

  if (!isAuthenticated) {
    return <AuthForm onLogin={handleLogin} />;
  }

  return (
    <Routes>
      <Route element={
        <DashboardLayout
          userEmail={userEmail}
          userAvatar={userAvatar}
          theme={theme}
          toggleTheme={toggleTheme}
          handleLogout={handleLogout}
          handleAvatarChange={handleAvatarChange}
        />
      }>
        <Route path="/*" element={<AppRoutes theme={theme} toggleTheme={toggleTheme} />} />
      </Route>
    </Routes>
  );
}

export default App;
