import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search, Code2, Globe, Database, Terminal, Cpu, Layers,
    Layout, BookOpen, Server, Zap, Shield, Box
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const LandingPage = () => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [activeTab, setActiveTab] = useState('POPULAR');
    const [searchQuery, setSearchQuery] = useState('');

    const languages = [
        // Popular
        { name: 'JavaScript', icon: <Code2 size={24} />, category: 'POPULAR', id: 'javascript' },
        { name: 'Python', icon: <Terminal size={24} />, category: 'POPULAR', id: 'python' },
        { name: 'Node.js', icon: <Server size={24} />, category: 'POPULAR', id: 'javascript' },
        { name: 'TypeScript', icon: <Code2 size={24} />, category: 'POPULAR', id: 'typescript' },
        { name: 'React', icon: <Box size={24} />, category: 'POPULAR', id: 'web-editor' },
        { name: 'Java', icon: <Code2 size={24} />, category: 'POPULAR', id: 'java' },

        // Web
        { name: 'HTML5/CSS3', icon: <Globe size={24} />, category: 'WEB', id: 'html' },
        { name: 'React.js', icon: <Layers size={24} />, category: 'WEB', id: 'web-editor' },
        { name: 'Next.js', icon: <Zap size={24} />, category: 'WEB', id: 'web-editor' },
        { name: 'Vue.js', icon: <Globe size={24} />, category: 'WEB', id: 'web-editor' },
        { name: 'Angular', icon: <Shield size={24} />, category: 'WEB', id: 'web-editor' },
        { name: 'Svelte', icon: <Zap size={24} />, category: 'WEB', id: 'web-editor' },
        { name: 'Tailwind CSS', icon: <Layout size={24} />, category: 'WEB', id: 'web-editor' },
        { name: 'PHP', icon: <Globe size={24} />, category: 'WEB', id: 'php' },

        // Backend & DB
        { name: 'Express.js', icon: <Server size={24} />, category: 'FULLSTACK', id: 'javascript' },
        { name: 'MongoDB', icon: <Database size={24} />, category: 'FULLSTACK', id: 'mongodb' },
        { name: 'React.js', icon: <Layers size={24} />, category: 'FULLSTACK', id: 'web-editor' },
        { name: 'MySQL', icon: <Database size={24} />, category: 'DATABASES', id: 'mysql' },
        { name: 'PostgreSQL', icon: <Database size={24} />, category: 'DATABASES', id: 'postgres' },
        { name: 'Redis', icon: <Zap size={24} />, category: 'DATABASES', id: 'redis' },
        { name: 'Firebase', icon: <Zap size={24} />, category: 'FULLSTACK', id: 'javascript' },

        // Programming
        { name: 'C++', icon: <Code2 size={24} />, category: 'PROGRAMMING', id: 'cpp' },
        { name: 'C#', icon: <Code2 size={24} />, category: 'PROGRAMMING', id: 'csharp' },
        { name: 'C', icon: <Terminal size={24} />, category: 'PROGRAMMING', id: 'c' },
        { name: 'Go', icon: <Cpu size={24} />, category: 'PROGRAMMING', id: 'go' },
        { name: 'Rust', icon: <Cpu size={24} />, category: 'PROGRAMMING', id: 'rust' },
        { name: 'Kotlin', icon: <Code2 size={24} />, category: 'PROGRAMMING', id: 'kotlin' },
        { name: 'Swift', icon: <BookOpen size={24} />, category: 'PROGRAMMING', id: 'swift' },
        { name: 'Ruby', icon: <BookOpen size={24} />, category: 'PROGRAMMING', id: 'ruby' },
        { name: 'Dart', icon: <Layers size={24} />, category: 'PROGRAMMING', id: 'dart' },
        { name: 'R', icon: <BookOpen size={24} />, category: 'PROGRAMMING', id: 'r' },
        { name: 'Julia', icon: <BookOpen size={24} />, category: 'PROGRAMMING', id: 'julia' },

        // Others
        { name: 'Bash', icon: <Terminal size={24} />, category: 'OTHERS', id: 'bash' },
        { name: 'Docker', icon: <Box size={24} />, category: 'OTHERS', id: 'docker' },
        { name: 'Kubernetes', icon: <Layers size={24} />, category: 'OTHERS', id: 'k8s' },
        { name: 'Assembly', icon: <Cpu size={24} />, category: 'PROGRAMMING', id: 'asm' },
    ];

    const categories = ['POPULAR', 'FULLSTACK', 'PROGRAMMING', 'WEB', 'DATABASES', 'OTHERS'];

    const filteredLanguages = languages.filter(lang =>
        (activeTab === 'POPULAR' || lang.category === activeTab) &&
        lang.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={`app-container ${theme}`}>
            <Header title="AMYPO COMPILER" theme={theme} toggleTheme={toggleTheme} />

            <main className="landing-container">
                <section className="hero animate-in">
                    <div className="badge animate-in">New: Web Editor with Live Preview ⚡</div>
                    <h1 className="hero-title">
                        Build the Future of <span className="gradient-text">Software.</span>
                    </h1>
                    <p className="hero-subtitle">
                        The ultimate cloud workspace for modern developers. Compile, test, and deploy in 40+ technologies with zero configuration.
                    </p>

                    <div className="search-wrapper">
                        <div className="search-container glass-card">
                            <Search className="search-icon" size={20} />
                            <input
                                type="text"
                                placeholder="Search languages, frameworks, databases..."
                                className="search-input"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </section>

                <section className="tabs-container animate-in" style={{ animationDelay: '0.1s' }}>
                    <div className="tabs-scroll">
                        <div className="tabs">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    className={`tab-btn ${activeTab === cat ? 'active' : ''}`}
                                    onClick={() => setActiveTab(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="language-grid">
                        {filteredLanguages.map((lang, idx) => (
                            <div
                                key={idx}
                                className="language-card glass-card animate-in"
                                style={{ animationDelay: `${0.1 + idx * 0.03}s` }}
                                onClick={() => {
                                    if (lang.id === 'html' || lang.id === 'web-editor') {
                                        navigate('/web-editor');
                                    } else {
                                        localStorage.setItem('compiler-lang', lang.id);
                                        navigate('/editor');
                                    }
                                }}
                            >
                                <div className="lang-icon-wrapper">
                                    {lang.icon}
                                </div>
                                <span className="lang-name">{lang.name}</span>
                                <div className="card-shine"></div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default LandingPage;
