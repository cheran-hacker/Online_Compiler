import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { LANGUAGES, CATEGORIES } from '../constants/languages';

const LandingPage = () => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [activeTab, setActiveTab] = useState('POPULAR');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredLanguages = LANGUAGES.filter(lang =>
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
                        Write, Run, and Share <br /><span className="gradient-text">Code Online.</span>
                    </h1>
                    <p className="hero-subtitle">
                        A power-packed online compiler for developers. Support for 40+ languages, smart inputs, and live web preview.
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
                            {CATEGORIES.map(cat => (
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
                                    if (lang.type === 'web') {
                                        if (lang.name === 'React') {
                                            localStorage.setItem('web-js', `const App = () => {\n  return (\n    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>\n      <h1 style={{ color: '#8b5cf6' }}>⚛️ Hello React!</h1>\n      <p>Start building your component here.</p>\n    </div>\n  );\n};\n\nconst root = ReactDOM.createRoot(document.getElementById('root'));\nroot.render(<App />);`);
                                            localStorage.setItem('web-html', '');
                                            localStorage.setItem('web-css', '');
                                        } else if (lang.name === 'Angular') {
                                            localStorage.setItem('web-html', `<div ng-app="myApp" ng-controller="myCtrl">\n  <h1 style="color: #dd0031">{{ firstName + " " + lastName }}</h1>\n  <p>Start building your AngularJS app here.</p>\n</div>`);
                                            localStorage.setItem('web-js', `var app = angular.module('myApp', []);\napp.controller('myCtrl', function($scope) {\n  $scope.firstName = "Hello";\n  $scope.lastName = "Angular";\n});`);
                                            localStorage.setItem('web-css', '');
                                        }
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
