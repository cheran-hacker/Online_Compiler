import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Code, LogOut } from 'lucide-react';
import Spinner from '../components/Spinner';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const { token, logout } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [snippets, setSnippets] = useState([]);

    const fetchProfile = React.useCallback(async () => {
        try {
            const res = await axios.get('http://localhost:5000/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(res.data);

            // Also fetch history/snippets
            const historyRes = await axios.get('http://localhost:5000/history', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSnippets(historyRes.data);

        } catch (err) {
            console.error("Failed to fetch profile/data", err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetchProfile();
    }, [token, navigate, fetchProfile]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) return <div className="full-screen-center"><Spinner /></div>;
    if (!profile) return <div className="full-screen-center">Failed to load profile</div>;

    return (
        <div className="profile-layout fade-in">
            {/* 1. Main Profile Card */}
            <div className="profile-card glass-card">
                <div className="profile-main">
                    <div className="avatar-large glow-effect">
                        {profile.user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="profile-identity">
                        <h1>{profile.user.username}</h1>
                        <div className="user-badges">
                            <span className="pro-badge">PRO</span>
                        </div>
                    </div>
                </div>

                <div className="stats-row">
                    <div className="stat-unit">
                        <span className="stat-value">{profile.stats.totalSnippets}</span>
                        <span className="stat-label">Snippets Saved</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-unit">
                        <span className="stat-value">{new Date(profile.stats.joinedAt).toLocaleDateString()}</span>
                        <span className="stat-label">Joined</span>
                    </div>
                </div>

                <div className="profile-actions">
                    <button className="btn btn-danger-glow full-width" onClick={handleLogout}>
                        <LogOut size={18} /> <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* 2. Snippets List Card */}
            <div className="snippets-card glass-card">
                <h3 className="card-heading">Recent Snippets</h3>
                <div className="snippets-container custom-scrollbar">
                    {snippets.length === 0 ? (
                        <div className="empty-state">
                            <Code size={40} strokeWidth={1} style={{ opacity: 0.3 }} />
                            <p>No snippets saved yet.</p>
                        </div>
                    ) : (
                        snippets.map((snip) => (
                            <div key={snip._id} className="snippet-row">
                                <div className="snippet-icon">
                                    <div className={`lang-box ${snip.language}`}>
                                        {snip.language === 'javascript' ? 'JS' :
                                            snip.language === 'python' ? 'PY' :
                                                snip.language === 'cpp' ? 'C++' :
                                                    snip.language.substring(0, 2).toUpperCase()}
                                    </div>
                                </div>
                                <div className="snippet-details">
                                    <div className="snippet-meta">
                                        <span className="lang-name-highlight">{snip.language.toUpperCase()}</span>
                                        <span className="snippet-date">{new Date(snip.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="snippet-preview-text">
                                        {snip.code.substring(0, 50).replace(/\n/g, ' ')}...
                                    </div>
                                </div>
                                <button
                                    className="btn-open-solid"
                                    onClick={() => {
                                        // Routing Logic
                                        const webLangs = ['html', 'css', 'javascript', 'react', 'angular', 'vue', 'html5', 'css3'];
                                        const isWeb = webLangs.includes(snip.language) || snip.language.toLowerCase().includes('react');

                                        if (isWeb) {
                                            try {
                                                const content = JSON.parse(snip.code);
                                                if (content.html !== undefined || content.css !== undefined || content.js !== undefined) {
                                                    localStorage.setItem('web-html', content.html || '');
                                                    localStorage.setItem('web-css', content.css || '');
                                                    localStorage.setItem('web-js', content.js || '');
                                                    navigate('/web-editor');
                                                    return;
                                                }
                                            } catch (e) { }

                                            localStorage.setItem('web-html', '');
                                            localStorage.setItem('web-css', '');
                                            localStorage.setItem('web-js', '');
                                            if (snip.language.includes('html')) localStorage.setItem('web-html', snip.code);
                                            else if (snip.language.includes('css')) localStorage.setItem('web-css', snip.code);
                                            else localStorage.setItem('web-js', snip.code);

                                            navigate('/web-editor');
                                        } else {
                                            localStorage.setItem('compiler-lang', snip.language);
                                            localStorage.setItem(`code-${snip.language}`, snip.code);
                                            navigate('/editor');
                                        }
                                    }}
                                >
                                    Open
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <style jsx>{`
                .profile-layout {
                    min-height: calc(100vh - 70px);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 60px 20px;
                    gap: 32px;
                    max-width: 550px;
                    margin: 0 auto;
                }

                .profile-card {
                    width: 100%;
                    background: var(--bg-card); /* Will map to dark in dark mode */
                    padding: 48px;
                    border-radius: 24px;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    border: 1px solid var(--border);
                    position: relative;
                    overflow: hidden;
                }

                .avatar-large {
                    width: 110px;
                    height: 110px;
                    background: linear-gradient(135deg, #8b5cf6, #6366f1);
                    color: white;
                    border-radius: 50%;
                    font-size: 3.5rem;
                    font-weight: 800;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 20px;
                    position: relative;
                    z-index: 2;
                }
                
                .glow-effect {
                    box-shadow: 0 0 40px rgba(139, 92, 246, 0.5);
                }

                .profile-identity h1 {
                    font-size: 2rem;
                    font-weight: 800;
                    margin-bottom: 8px;
                    color: var(--text);
                }

                .user-badges {
                    display: flex;
                    justify-content: center;
                    gap: 8px;
                    margin-bottom: 4px;
                }

                .pro-badge {
                    background: linear-gradient(90deg, #3b82f6, #8b5cf6);
                    color: white;
                    font-size: 0.7rem;
                    font-weight: 800;
                    padding: 2px 8px;
                    border-radius: 4px;
                    letter-spacing: 1px;
                }

                .stats-row {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 40px;
                    margin-bottom: 40px;
                    margin-top: 10px;
                    width: 100%;
                }

                .stat-value {
                    font-size: 1.8rem;
                    font-weight: 900;
                    color: var(--text);
                    line-height: 1;
                    margin-bottom: 6px;
                }

                .stat-label {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .stat-divider {
                    width: 1px;
                    height: 40px;
                    background: var(--border);
                    opacity: 0.5;
                }

                .btn-danger-glow {
                    background: #f43f5e; /* Rose 500 */
                    color: white;
                    width: 100%;
                    padding: 16px;
                    border-radius: 12px;
                    border: none;
                    font-weight: 700;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 10px;
                    cursor: pointer;
                    transition: all 0.3s;
                    box-shadow: 0 8px 25px -5px rgba(244, 63, 94, 0.5);
                }

                .btn-danger-glow:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 30px -5px rgba(244, 63, 94, 0.6);
                }

                /* Snippets Card - Solid & Dark */
                .snippets-card {
                    width: 100%;
                    background: var(--bg-card);
                    border-radius: 24px;
                    overflow: hidden;
                    border: 1px solid var(--border);
                    display: flex;
                    flex-direction: column;
                }

                .card-heading {
                    padding: 24px;
                    font-size: 1.1rem;
                    font-weight: 800;
                    border-bottom: 1px solid var(--border);
                    margin: 0;
                    text-align: left;
                }

                .snippet-row {
                    display: flex;
                    align-items: center;
                    padding: 20px;
                    border-bottom: 1px solid var(--border);
                    transition: all 0.2s;
                    gap: 20px;
                    background: transparent;
                }
                
                .snippet-row:last-child {
                    border-bottom: none;
                }

                .snippet-row:hover {
                    background: rgba(125,125,125,0.03);
                }

                .lang-box {
                    width: 48px;
                    height: 48px;
                    border-radius: 10px;
                    background: #1e1e24; /* Dark box */
                    color: #a78bfa;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 800;
                    font-size: 0.9rem;
                    text-transform: uppercase;
                    border: 1px solid rgba(255,255,255,0.1);
                }
                
                /* Specific Colors */
                .lang-box.javascript { color: #facc15; }
                .lang-box.python { color: #60a5fa; }
                .lang-box.html { color: #f97316; }

                .lang-name-highlight {
                    font-weight: 800;
                    font-size: 0.9rem;
                    color: #6366f1; /* Indigo */
                    display: block;
                    margin-bottom: 4px;
                }

                .snippet-date {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                }

                .btn-open-solid {
                    background: #6366f1;
                    color: white;
                    border: none;
                    padding: 8px 20px;
                    border-radius: 8px;
                    font-weight: 700;
                    cursor: pointer;
                    font-size: 0.85rem;
                    transition: all 0.2s;
                    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
                }

                .btn-open-solid:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 6px 15px rgba(99, 102, 241, 0.5);
                }


                .full-screen-center {
                     height: 100vh;
                     display: flex;
                     align-items: center;
                     justify-content: center;
                     color: var(--text-muted);
                }
            `}</style>
        </div>
    );
};

export default ProfilePage;
