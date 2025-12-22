import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';

const WebEditor = () => {
    const { theme, toggleTheme } = useTheme();
    const [html, setHtml] = useState(localStorage.getItem('web-html') || '<h1>Hello World</h1>');
    const [css, setCss] = useState(localStorage.getItem('web-css') || 'h1 { color: #007acc; }');
    const [js, setJs] = useState(localStorage.getItem('web-js') || 'console.log("Web project loaded");');
    const [activeTab, setActiveTab] = useState('html');
    const [srcDoc, setSrcDoc] = useState('');

    useEffect(() => {
        const timeout = setTimeout(() => {
            setSrcDoc(`
                <html>
                    <body>${html}</body>
                    <style>${css}</style>
                    <script>${js}</script>
                </html>
            `);
            localStorage.setItem('web-html', html);
            localStorage.setItem('web-css', css);
            localStorage.setItem('web-js', js);
        }, 500);
        return () => clearTimeout(timeout);
    }, [html, css, js]);

    const activeCode = activeTab === 'html' ? html : activeTab === 'css' ? css : js;
    const activeLang = activeTab === 'html' ? 'html' : activeTab === 'css' ? 'css' : 'javascript';
    const setActiveCode = activeTab === 'html' ? setHtml : activeTab === 'css' ? setCss : setJs;

    return (
        <div className={`app-container ${theme}`}>
            <Header title="AMYPO COMPILER" theme={theme} toggleTheme={toggleTheme} />
            <div className="web-editor-layout">
                <div className="web-editor-pane glass-card">
                    <div className="web-tabs">
                        <button className={`tab-btn ${activeTab === 'html' ? 'active' : ''}`} onClick={() => setActiveTab('html')}>HTML</button>
                        <button className={`tab-btn ${activeTab === 'css' ? 'active' : ''}`} onClick={() => setActiveTab('css')}>CSS</button>
                        <button className={`tab-btn ${activeTab === 'js' ? 'active' : ''}`} onClick={() => setActiveTab('js')}>JS</button>
                    </div>
                    <Editor
                        height="calc(100% - 40px)"
                        theme={theme === 'dark' ? 'vs-dark' : 'light'}
                        language={activeLang}
                        value={activeCode}
                        onChange={(value) => setActiveCode(value)}
                        options={{
                            fontSize: 14,
                            minimap: { enabled: false },
                            automaticLayout: true,
                        }}
                    />
                </div>
                <div className="web-preview-pane glass-card">
                    <div className="panel-header">Preview</div>
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
            <Footer />
        </div>
    );
};

export default WebEditor;
