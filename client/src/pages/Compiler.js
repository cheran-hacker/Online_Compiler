import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Spinner from '../components/Spinner';
import { useTheme } from '../context/ThemeContext';

const Compiler = () => {
    const { theme, toggleTheme } = useTheme();
    const [code, setCode] = useState(() => {
        return localStorage.getItem('compiler-code') || '// Write your code here\nconsole.log("Hello, World!");';
    });
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('compiler-lang') || 'javascript';
    });
    const [output, setOutput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    React.useEffect(() => {
        localStorage.setItem('compiler-code', code);
        localStorage.setItem('compiler-lang', language);
    }, [code, language]);

    const runCode = async () => {
        setLoading(true);
        setError('');
        setOutput('');
        try {
            const response = await axios.post('http://localhost:5000/run', {
                language,
                code
            });
            setOutput(response.data.output);
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.error || 'Execution Error');
                setOutput(err.response.data.stderr || '');
            } else {
                setError('Server Error');
            }
        } finally {
            setLoading(false);
        }
    };

    const defaultCode = {
        javascript: '// Write your code here\nconsole.log("Hello, World!");',
        typescript: '// TypeScript empowered code\nlet message: string = "Hello, TypeScript!";\nconsole.log(message);',
        python: '# Write your code here\nprint("Hello, World!")',
        react: '// Functional React Component Template\nimport React from "react";\n\nconst App = () => {\n  return <h1>Hello from AMYPO!</h1>;\n};',
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

    const handleLanguageChange = (e) => {
        const lang = e.target.value;
        setLanguage(lang);
        if (!code || code === defaultCode[language]) {
            setCode(defaultCode[lang] || '');
        }
    };

    const clearOutput = () => {
        setOutput('');
        setError('');
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
                loading={loading}
            />
            <main className="main-content">
                <div className="editor-panel glass-card">
                    <Editor
                        height="100%"
                        theme={theme === 'dark' ? 'vs-dark' : 'light'}
                        language={language}
                        value={code}
                        onChange={(value) => setCode(value)}
                        options={{
                            fontSize: 14,
                            minimap: { enabled: false },
                            automaticLayout: true,
                        }}
                    />
                </div>
                <aside className="output-panel glass-card">
                    <div className="panel-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                            <span style={{ flexShrink: 0 }}>Output</span>
                            {error && (
                                <span className="animate-in" style={{ color: '#f87171', fontSize: '0.75rem', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    • {error}
                                </span>
                            )}
                        </div>
                        <button
                            id="clear-btn"
                            className="btn"
                            style={{ padding: '6px 14px', fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)' }}
                            onClick={clearOutput}
                        >
                            Clear
                        </button>
                    </div>
                    <div className="output-content">
                        {loading ? <Spinner /> : (output || (error ? '' : 'Run code to see output here...'))}
                    </div>
                </aside>
            </main>
            <Footer />
        </div>
    );
};

export default Compiler;
