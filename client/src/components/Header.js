import { Link } from 'react-router-dom';
import { Sun, Moon, Play } from 'lucide-react';

const Header = ({ title, theme, toggleTheme, language, onLanguageChange, onRun, loading }) => {
    return (
        <header className="header">
            <Link to="/" className="logo-text" style={{ textDecoration: 'none' }}>⚡ {title}</Link>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                {onLanguageChange && (
                    <select
                        className="select-lang"
                        value={language}
                        onChange={onLanguageChange}
                    >
                        <option value="javascript">JavaScript</option>
                        <option value="typescript">TypeScript</option>
                        <option value="python">Python</option>
                        <option value="react">React.js</option>
                        <option value="express">Express.js</option>
                        <option value="mongodb">MongoDB</option>
                        <option value="cpp">C++</option>
                        <option value="java">Java</option>
                        <option value="go">Go</option>
                        <option value="rust">Rust</option>
                        <option value="php">PHP</option>
                        <option value="mysql">MySQL</option>
                        <option value="csharp">C#</option>
                        <option value="ruby">Ruby</option>
                    </select>
                )}
                {onRun && (
                    <button
                        className="btn btn-primary"
                        onClick={onRun}
                        disabled={loading}
                    >
                        <Play size={16} fill="currentColor" />
                        {loading ? 'Running...' : 'Run Code'}
                    </button>
                )}
                <button
                    className="btn"
                    onClick={toggleTheme}
                    title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
                    style={{ padding: '10px' }}
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>
        </header>
    );
};

export default Header;
