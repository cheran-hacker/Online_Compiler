import { Code2, Globe, Database, Terminal, Cpu, Layers, Layout, BookOpen, Server, Zap, Shield } from 'lucide-react';

export const LANGUAGES = [
    // Popular
    { name: 'JavaScript', icon: <Code2 size={24} />, category: 'POPULAR', id: 'javascript', type: 'code' },
    { name: 'Python', icon: <Terminal size={24} />, category: 'POPULAR', id: 'python', type: 'code' },
    { name: 'Java', icon: <Code2 size={24} />, category: 'POPULAR', id: 'java', type: 'code' },
    { name: 'C++', icon: <Code2 size={24} />, category: 'POPULAR', id: 'cpp', type: 'code' },
    { name: 'C', icon: <Terminal size={24} />, category: 'POPULAR', id: 'c', type: 'code' },
    { name: 'Go', icon: <Cpu size={24} />, category: 'POPULAR', id: 'go', type: 'code' },

    // Web
    { name: 'HTML5', icon: <Globe size={24} />, category: 'WEB', id: 'html', type: 'web' },
    { name: 'CSS3', icon: <Layout size={24} />, category: 'WEB', id: 'css', type: 'web' },
    { name: 'React', icon: <Layers size={24} />, category: 'WEB', id: 'react', type: 'web' }, // Typically web editor
    { name: 'Angular', icon: <Shield size={24} />, category: 'WEB', id: 'angular', type: 'web' },
    { name: 'Vue.js', icon: <Globe size={24} />, category: 'WEB', id: 'vue', type: 'web' },
    { name: 'TypeScript', icon: <Code2 size={24} />, category: 'WEB', id: 'typescript', type: 'code' },

    // Backend
    { name: 'Node.js', icon: <Server size={24} />, category: 'FULLSTACK', id: 'nodejs', type: 'code' },
    { name: 'Express', icon: <Server size={24} />, category: 'FULLSTACK', id: 'express', type: 'code' },
    { name: 'PHP', icon: <Globe size={24} />, category: 'FULLSTACK', id: 'php', type: 'code' },
    { name: 'Ruby', icon: <BookOpen size={24} />, category: 'FULLSTACK', id: 'ruby', type: 'code' },
    { name: 'Perl', icon: <Terminal size={24} />, category: 'FULLSTACK', id: 'perl', type: 'code' },
    { name: 'Django', icon: <Terminal size={24} />, category: 'FULLSTACK', id: 'python', type: 'code' },

    // Database
    { name: 'MySQL', icon: <Database size={24} />, category: 'DATABASES', id: 'mysql', type: 'code' },
    { name: 'MongoDB', icon: <Database size={24} />, category: 'DATABASES', id: 'mongodb', type: 'code' },
    { name: 'PostgreSQL', icon: <Database size={24} />, category: 'DATABASES', id: 'postgres', type: 'code' },
    { name: 'Redis', icon: <Zap size={24} />, category: 'DATABASES', id: 'redis', type: 'code' },
    { name: 'SQLite', icon: <Database size={24} />, category: 'DATABASES', id: 'sqlite', type: 'code' },

    // System
    { name: 'Rust', icon: <Cpu size={24} />, category: 'PROGRAMMING', id: 'rust', type: 'code' },
    { name: 'Assembly', icon: <Cpu size={24} />, category: 'PROGRAMMING', id: 'assembly', type: 'code' },
    { name: 'Fortran', icon: <Terminal size={24} />, category: 'PROGRAMMING', id: 'fortran', type: 'code' },
    { name: 'Pascal', icon: <Code2 size={24} />, category: 'PROGRAMMING', id: 'pascal', type: 'code' },
    { name: 'Bash', icon: <Terminal size={24} />, category: 'PROGRAMMING', id: 'bash', type: 'code' },
    { name: 'Swift', icon: <BookOpen size={24} />, category: 'PROGRAMMING', id: 'swift', type: 'code' },
    { name: 'Objective-C', icon: <Code2 size={24} />, category: 'PROGRAMMING', id: 'objectivec', type: 'code' },

    // Others
    { name: 'Haskell', icon: <Code2 size={24} />, category: 'OTHERS', id: 'haskell', type: 'code' },
    { name: 'Lua', icon: <Globe size={24} />, category: 'OTHERS', id: 'lua', type: 'code' },
    { name: 'R', icon: <BookOpen size={24} />, category: 'OTHERS', id: 'r', type: 'code' },
    { name: 'Scala', icon: <Code2 size={24} />, category: 'OTHERS', id: 'scala', type: 'code' },
    { name: 'Kotlin', icon: <Code2 size={24} />, category: 'OTHERS', id: 'kotlin', type: 'code' },
    { name: 'Dart', icon: <Layers size={24} />, category: 'OTHERS', id: 'dart', type: 'code' },
    { name: 'Elixir', icon: <Zap size={24} />, category: 'OTHERS', id: 'elixir', type: 'code' },
    { name: 'Clojure', icon: <Code2 size={24} />, category: 'OTHERS', id: 'clojure', type: 'code' },
    { name: 'F#', icon: <Code2 size={24} />, category: 'OTHERS', id: 'fsharp', type: 'code' },
    { name: 'Cobol', icon: <Terminal size={24} />, category: 'OTHERS', id: 'cobol', type: 'code' },
    { name: 'Groovy', icon: <Zap size={24} />, category: 'OTHERS', id: 'groovy', type: 'code' },
    { name: 'Tcl', icon: <Terminal size={24} />, category: 'OTHERS', id: 'tcl', type: 'code' },
    { name: 'C#', icon: <Code2 size={24} />, category: 'PROGRAMMING', id: 'csharp', type: 'code' },
];

export const CATEGORIES = ['POPULAR', 'FULLSTACK', 'PROGRAMMING', 'WEB', 'DATABASES', 'OTHERS'];
