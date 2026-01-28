import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="footer-advanced glass-card">
            <div className="footer-content">
                <div className="footer-brand">
                    <div className="brand-logo">
                        <Code2 size={28} className="logo-icon" />
                        <span className="logo-text">AMYPO</span>
                    </div>
                    <p className="brand-desc">
                        Run code in 40+ programming languages on the cloud.
                        The most powerful online compiler for developers.
                    </p>
                    <div className="brand-socials">
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Github"><Github size={20} /></a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Twitter"><Twitter size={20} /></a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn"><Linkedin size={20} /></a>
                    </div>
                </div>

                <div className="footer-links">
                    <div className="link-column">
                        <h4>Platform</h4>
                        <Link to="/">Online Compiler</Link>
                        <Link to="/web-editor">Web Editor</Link>
                        <Link to="/pricing">Pricing</Link>
                        <Link to="/api">API</Link>
                    </div>
                    <div className="link-column">
                        <h4>Resources</h4>
                        <Link to="/docs">Documentation</Link>
                        <Link to="/tutorials">Tutorials</Link>
                        <Link to="/cheatsheets">Cheatsheets</Link>
                        <Link to="/blog">Blog</Link>
                    </div>
                    <div className="link-column">
                        <h4>Company</h4>
                        <Link to="/about">About</Link>
                        <Link to="/careers">Careers</Link>
                        <Link to="/privacy">Privacy</Link>
                        <Link to="/terms">Terms</Link>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© {new Date().getFullYear()} AMYPO Compiler Inc. All rights reserved.</p>
                <div className="footer-downtag">Built with ❤️ for coders</div>
            </div>
        </footer>
    );
};

export default Footer;
