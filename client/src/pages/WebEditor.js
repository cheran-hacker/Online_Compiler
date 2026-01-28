import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import Header from '../components/Header';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

const WebEditor = () => {
    const { theme, toggleTheme } = useTheme();
    const [html, setHtml] = useState(localStorage.getItem('web-html') || '<h1>Hello World</h1>');
    const [css, setCss] = useState(localStorage.getItem('web-css') || 'h1 { color: #007acc; }');
    const [js, setJs] = useState(localStorage.getItem('web-js') || 'console.log("Web project loaded");');
    const [activeTab, setActiveTab] = useState('html');
    const [srcDoc, setSrcDoc] = useState('');

    const [liveMode, setLiveMode] = useState(false);

    const handleRun = React.useCallback(() => {
        setSrcDoc(`
            <html>
                <head>
                    <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
                    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
                    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
                    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>
                    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
                    <style>body { margin: 0; font-family: sans-serif; } ${css}</style>
                </head>
                <body>
                    <div id="root"></div>
                    ${html}
                    <script type="${(js.includes('React') || js.includes('jsx') || js.includes('import ')) ? 'text/babel' : 'text/javascript'}">
                        try {
                            ${js}
                        } catch (err) {
                            document.body.innerHTML += '<div style="color:red; padding:10px; background:#ffebeb; border:1px solid red; margin-top:20px;">' + err.message + '</div>';
                        }
                    </script>
                </body>
            </html>
        `);
        localStorage.setItem('web-html', html);
        localStorage.setItem('web-css', css);
        localStorage.setItem('web-js', js);
    }, [html, css, js]);

    // Auto-run effect when liveMode is on
    useEffect(() => {
        if (!liveMode) return;
        const timeout = setTimeout(() => {
            handleRun();
        }, 800);
        return () => clearTimeout(timeout);
    }, [html, css, js, liveMode, handleRun]);

    // Initial run on mount
    useEffect(() => {
        handleRun();
    }, [handleRun]);

    const activeCode = activeTab === 'html' ? html : activeTab === 'css' ? css : js;
    const activeLang = activeTab === 'html' ? 'html' : activeTab === 'css' ? 'css' : 'javascript';
    const setActiveCode = activeTab === 'html' ? setHtml : activeTab === 'css' ? setCss : setJs;

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error("Please login to save your project!");
            return;
        }

        const toastId = toast.loading("Saving project...");
        try {
            const compositeCode = JSON.stringify({ html, css, js });
            const response = await fetch('http://localhost:5000/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    language: 'react',
                    code: compositeCode,
                    title: "Web Project"
                })
            });

            if (response.ok) {
                toast.success("Project saved successfully!", { id: toastId });
            } else {
                toast.error("Failed to save project", { id: toastId });
            }
        } catch (err) {
            console.error(err);
            toast.error("Error saving project", { id: toastId });
        }
    };

    return (
        <div className={`app-container ${theme}`}>
            <Header
                title="AMYPO WEB COMPILER"
                theme={theme}
                toggleTheme={toggleTheme}
                onSave={handleSave}
            />

            <div className="web-editor-layout">
                {/* Editor Panel */}
                <div className="web-editor-pane glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="web-toolbar" style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid var(--border)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: 'var(--bg-card)'
                    }}>
                        <div className="web-tabs" style={{ background: 'transparent', padding: 0 }}>
                            {['html', 'css', 'js'].map(tab => (
                                <button
                                    key={tab}
                                    className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab)}
                                    style={{
                                        padding: '6px 16px',
                                        borderRadius: '8px',
                                        textTransform: 'uppercase',
                                        fontSize: '0.85rem'
                                    }}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                <input
                                    type="checkbox"
                                    checked={liveMode}
                                    onChange={(e) => setLiveMode(e.target.checked)}
                                />
                                Live Auto-Run
                            </label>
                            <button
                                className="btn btn-primary"
                                onClick={() => { handleRun(); toast.success("Ran successfully!"); }}
                                style={{ padding: '8px 20px', fontSize: '0.9rem' }}
                            >
                                Run &gt;
                            </button>
                        </div>
                    </div>

                    <Editor
                        height="100%"
                        theme={theme === 'dark' ? 'vs-dark' : 'light'}
                        language={activeLang}
                        value={activeCode}
                        onChange={(value) => setActiveCode(value)}
                        options={{
                            fontSize: 14,
                            minimap: { enabled: false },
                            automaticLayout: true,
                            padding: { top: 16 }
                        }}
                    />
                </div>

                {/* Preview Panel */}
                <div className="web-preview-pane glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="panel-header" style={{ background: 'var(--bg-card)' }}>Preview</div>
                    <div style={{ flex: 1, background: 'white' }}>
                        <iframe
                            srcDoc={srcDoc}
                            title="output"
                            sandbox="allow-scripts"
                            frameBorder="0"
                            width="100%"
                            height="100%"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WebEditor;
