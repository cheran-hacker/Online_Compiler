import { Link } from 'react-router-dom';
import { Sun, Moon, Play, Save, Clock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LANGUAGES } from '../constants/languages';

const Header = ({ title, theme, toggleTheme, language, onLanguageChange, onRun, onSave, onHistory, loading }) => {
    const { token } = useAuth();
    return (
        <header className="header glass-card" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0 }}>
            <Link to="/" className="logo-text" style={{ textDecoration: 'none' }}>⚡ Amypo Compiler</Link>
            <div className="header-actions" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                {onLanguageChange && (
                    <div className="select-wrapper">
                        <select
                            className="select-lang"
                            value={language}
                            onChange={onLanguageChange}
                        >
                            {LANGUAGES.filter(l => l.type === 'code').map(lang => (
                                <option key={lang.id + lang.name} value={lang.id}>
                                    {lang.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {onRun && (
                    <button
                        className="btn btn-primary"
                        onClick={onRun}
                        disabled={loading}
                    >
                        {loading ? <div className="spinner-sm" /> : <Play size={18} fill="currentColor" />}
                        <span className="btn-text">{loading ? 'Running...' : 'Run Code'}</span>
                    </button>
                )}

                {token ? (
                    <>
                        {onSave && (
                            <button className="btn btn-secondary" onClick={onSave} title="Save Snippet">
                                <Save size={18} />
                                <span className="btn-text">Save</span>
                            </button>
                        )}
                        {onHistory && (
                            <button className="btn btn-ghost" onClick={onHistory} title="View History">
                                <Clock size={18} />
                                <span className="btn-text">History</span>
                            </button>
                        )}
                        <Link to="/profile" className="btn btn-ghost" title="Profile">
                            <User size={20} />
                        </Link>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="btn btn-ghost">Login</Link>
                        <Link to="/register" className="btn btn-primary">Sign Up</Link>
                    </>
                )}

                <button
                    className="btn btn-ghost"
                    onClick={toggleTheme}
                    title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>
        </header>
    );
};

export default Header;
