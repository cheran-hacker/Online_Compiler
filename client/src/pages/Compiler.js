
import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Spinner from '../components/Spinner';
import HistoryPanel from '../components/HistoryPanel';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Compiler = () => {
    const { theme, toggleTheme } = useTheme();
    const { token } = useAuth();
    const [showHistory, setShowHistory] = useState(false);

    // Default code snippets
    const defaultCode = {
        javascript: '// Write your code here\nconsole.log("Hello, World!");',
        typescript: '// TypeScript empowered code\nlet message: string = "Hello, TypeScript!";\nconsole.log(message);',
        python: '# Write your code here\nprint("Hello, World!")',
        react: '// Functional React Component Template\nimport React from "react";\n\nconst App = () => {\n  return <h1>Hello from AMYPO!</h1>;\n};',
        express: 'const express = require("express");\nconst app = express();\nconst port = 3000;\n\napp.get("/", (req, res) => {\n  res.send("Hello World!");\n});\n\nconsole.log("Express Code Ready (Note: Long running processes may timeout)");',
        mongodb: '// MongoDB Playground\nuse("test");\ndb.users.insertOne({ name: "Alice", age: 30 });\ndb.users.find();',
        cpp: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}',
        c: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}',
        java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
        go: 'package main\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, Go!")\n}',
        rust: 'fn main() {\n    println!("Hello, Rust!");\n}',
        php: '<?php\necho "Hello, World!";\n?>',
        mysql: 'CREATE TABLE users (id INT, name VARCHAR(50));\nINSERT INTO users VALUES (1, "Alice");\nSELECT * FROM users;',
        csharp: 'using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, C#!");\n    }\n}',
        ruby: 'puts "Hello, Ruby!"',
        swift: 'print("Hello, Swift!")',
        bash: 'echo "Hello, Bash!"',
        pascal: 'program HelloWorld;\nbegin\n  writeln(\'Hello, World!\');\nend.',
        fortran: 'program hello\n  print *, "Hello, World!"\nend program hello'
    };

    // Initialize Language
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('compiler-lang') || 'javascript';
    });

    // Initialize Code - Load specifically for the current language
    const [code, setCode] = useState(() => {
        const savedLang = localStorage.getItem('compiler-lang') || 'javascript';
        // Try getting specific code for this language, fallback to generic if migration needed, then default
        return localStorage.getItem(`code-${savedLang}`) || defaultCode[savedLang] || '';
    });

    const [output, setOutput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [userInput, setUserInput] = useState('');
    const [activeTab, setActiveTab] = useState('input'); // 'input' or 'output'

    // Save code to local storage whenever it changes (Debounced effect conceptually, but direct here for simplicity)
    React.useEffect(() => {
        localStorage.setItem(`code-${language}`, code);
        localStorage.setItem('compiler-lang', language); // Also save current language preference
    }, [code, language]);

    const handleLanguageChange = (e) => {
        const newLang = e.target.value;

        // 1. Logic already saved 'current' code via useEffect, but to be safe/instant:
        localStorage.setItem(`code-${language}`, code);

        // 2. Load new code
        const savedCode = localStorage.getItem(`code-${newLang}`);
        const nextCode = savedCode !== null ? savedCode : (defaultCode[newLang] || '');

        // 3. Update State
        setLanguage(newLang);
        setCode(nextCode);
    };

    const clearOutput = () => {
        setOutput('');
        setError('');
    };

    // Run Code Function
    const runCode = async () => {
        setLoading(true);
        setActiveTab('output'); // Auto-switch to output tab on run
        setError('');
        setOutput('');
        try {
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const response = await axios.post('http://localhost:5000/run', {
                language,
                code,
                input: userInput
            }, { headers });
            setOutput(response.data.output);
            if (response.data.stderr) {
                // warning or partial error
            }
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.error || 'Execution Error');
                setOutput(err.response.data.stderr || '');
            } else {
                setError('Server Error: Is the backend running?');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!token) {
            toast.error("Please login to save snippets!");
            return;
        }
        try {
            await axios.post('http://localhost:5000/save', {
                code,
                language,
                title: "Saved Snippet"
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Snippet saved successfully!");
        } catch (err) {
            toast.error("Failed to save snippet");
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(code).then(() => {
            toast.success("Code copied to clipboard!");
        });
    };

    const handleHistorySelect = (snippet) => {
        // Set language first
        setLanguage(snippet.language);
        // Then code
        setCode(snippet.code);

        // Also update local storage for persistence
        localStorage.setItem(`code-${snippet.language}`, snippet.code);
        localStorage.setItem('compiler-lang', snippet.language);

        if (snippet.output) setOutput(snippet.output);
        setShowHistory(false);
    };

    const getFileName = (lang) => {
        const map = {
            javascript: 'script.js',
            typescript: 'script.ts',
            python: 'main.py',
            java: 'Main.java',
            cpp: 'main.cpp',
            c: 'main.c',
            go: 'main.go',
            rust: 'main.rs',
            php: 'index.php',
            ruby: 'main.rb',
            swift: 'main.swift',
            mysql: 'query.sql',
            mongodb: 'query.js',
            bash: 'script.sh',
            html: 'index.html',
            css: 'style.css'
        };
        return map[lang.toLowerCase()] || 'sript.txt';
    };

    return (
        <div className={`app-container ${theme}`}>
            <Header
                title="AMYPO COMPILER"
                theme={theme}
                toggleTheme={toggleTheme}
                language={language}
                onLanguageChange={handleLanguageChange}
                onRun={runCode}
                onSave={handleSave}
                onHistory={() => setShowHistory(!showHistory)}
                onShare={handleShare}
                loading={loading}
            />
            <HistoryPanel
                isOpen={showHistory}
                onClose={() => setShowHistory(false)}
                onSelect={handleHistorySelect}
                token={token}
            />
            <main className="main-content">
                <div className="editor-panel glass-card">
                    <div className="panel-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ opacity: 0.6 }}>{'//'}</span>
                            <span style={{ color: theme === 'dark' ? '#fff' : '#000' }}>{getFileName(language)}</span>
                        </div>
                    </div>
                    <Editor
                        key={language}
                        height="calc(100% - 50px)" // Adjust height to account for header
                        theme={theme === 'dark' ? 'vs-dark' : 'light'}
                        language={language}
                        value={code}
                        onChange={(value) => setCode(value)}
                        options={{
                            fontSize: 14,
                            minimap: { enabled: false },
                            automaticLayout: true,
                            padding: { top: 16 }
                        }}
                    />
                </div>
                <aside className="output-panel glass-card" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
                    <div className="tabs-header" style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}>
                        <button
                            className={`tab-btn ${activeTab === 'input' ? 'active' : ''}`}
                            onClick={() => setActiveTab('input')}
                            style={{
                                flex: 1,
                                padding: '12px',
                                background: activeTab === 'input' ? 'transparent' : 'rgba(0,0,0,0.1)',
                                border: 'none',
                                borderBottom: activeTab === 'input' ? '2px solid #4ade80' : '2px solid transparent',
                                color: activeTab === 'input' ? '#fff' : 'rgba(255,255,255,0.5)',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '0.9rem',
                                transition: 'all 0.2s'
                            }}
                        >
                            STDIN (Input)
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'output' ? 'active' : ''}`}
                            onClick={() => setActiveTab('output')}
                            style={{
                                flex: 1,
                                padding: '12px',
                                background: activeTab === 'output' ? 'transparent' : 'rgba(0,0,0,0.1)',
                                border: 'none',
                                borderBottom: activeTab === 'output' ? '2px solid #4ade80' : '2px solid transparent',
                                color: activeTab === 'output' ? '#fff' : 'rgba(255,255,255,0.5)',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '0.9rem',
                                transition: 'all 0.2s'
                            }}
                        >
                            OUTPUT
                        </button>
                    </div>

                    <div className="tab-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
                        {/* Input Tab */}
                        {activeTab === 'input' && (
                            <textarea
                                className="custom-scrollbar"
                                style={{
                                    flex: 1,
                                    width: '100%',
                                    height: '100%',
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'inherit',
                                    padding: '16px',
                                    resize: 'none',
                                    outline: 'none',
                                    fontFamily: 'monospace',
                                    fontSize: '14px',
                                    lineHeight: '1.5'
                                }}
                                placeholder="Enter program input here (e.g. for scanf, input(), cin)..."
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                spellCheck="false"
                            />
                        )}

                        {/* Output Tab */}
                        {activeTab === 'output' && (
                            <div className="output-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                <div className="output-actions" style={{ padding: '8px 12px', display: 'flex', justifyContent: 'flex-end', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <button
                                        onClick={clearOutput}
                                        style={{
                                            background: 'transparent',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            color: 'rgba(255,255,255,0.7)',
                                            padding: '4px 10px',
                                            borderRadius: '4px',
                                            fontSize: '0.75rem',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Clear Console
                                    </button>
                                </div>
                                <div className="output-content" style={{ padding: '16px', overflow: 'auto', flex: 1 }}>
                                    {loading ? (
                                        <div className="full-center" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '10px' }}>
                                            <Spinner />
                                            <span style={{ opacity: 0.7, fontSize: '0.9rem' }}>Compiling & Executing...</span>
                                        </div>
                                    ) : error ? (
                                        <div className="terminal-error" style={{ whiteSpace: 'pre-wrap' }}>
                                            <div style={{ color: '#f87171', fontWeight: 'bold', marginBottom: '8px' }}>Execution Failed:</div>
                                            {error}
                                            {output && <div style={{ marginTop: '16px', color: '#9ca3af', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px' }}>{output}</div>}
                                        </div>
                                    ) : output ? (
                                        <pre style={{ margin: 0, fontFamily: "'Fira Code', monospace", whiteSpace: 'pre-wrap', color: '#4ade80' }}>
                                            {output}
                                        </pre>
                                    ) : (
                                        <div className="terminal-placeholder" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.3 }}>
                                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
                                            <div>Run your code to see output here</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </aside>
            </main>
            <Footer />
        </div>
    );
};

export default Compiler;
