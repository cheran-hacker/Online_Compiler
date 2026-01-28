import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Header from '../components/Header';
import { Mail, Lock, User } from 'lucide-react';

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/login', { email, password });
            login(res.data.token, res.data.username);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className={`app-container ${theme}`}>
            <Header title="AMYPO COMPILER" theme={theme} toggleTheme={toggleTheme} />
            <div className="auth-container">
                <div className="auth-card glass-card animate-in">
                    <div className="auth-header">
                        <h2>Login</h2>
                    </div>
                    {error && <p className="error-msg">{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label className="input-label">Email Address</label>
                            <div className="input-wrapper">
                                <Mail size={18} />
                                <input type="email" placeholder="name@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                            </div>
                        </div>
                        <div className="input-group">
                            <label className="input-label">Password</label>
                            <div className="input-wrapper">
                                <Lock size={18} />
                                <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary btn-block">Sign In</button>
                    </form>
                    <p className="auth-footer">
                        Don't have an account? <Link to="/register">Create one</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/register', { username, email, password });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className={`app-container ${theme}`}>
            <Header title="AMYPO COMPILER" theme={theme} toggleTheme={toggleTheme} />
            <div className="auth-container">
                <div className="auth-card glass-card animate-in">
                    <div className="auth-header">
                        <h2>Create Account</h2>
                    </div>
                    {error && <p className="error-msg">{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label className="input-label">Username</label>
                            <div className="input-wrapper">
                                <User size={18} />
                                <input type="text" placeholder="johndoe" value={username} onChange={e => setUsername(e.target.value)} required />
                            </div>
                        </div>
                        <div className="input-group">
                            <label className="input-label">Email Address</label>
                            <div className="input-wrapper">
                                <Mail size={18} />
                                <input type="email" placeholder="name@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                            </div>
                        </div>
                        <div className="input-group">
                            <label className="input-label">Password</label>
                            <div className="input-wrapper">
                                <Lock size={18} />
                                <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary btn-block">Sign Up</button>
                    </form>
                    <p className="auth-footer">
                        Already have an account? <Link to="/login">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
