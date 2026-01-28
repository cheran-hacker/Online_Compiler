import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { X, Clock } from 'lucide-react';

const HistoryPanel = ({ isOpen, onClose, onSelect, token }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchHistory = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5000/history', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHistory(res.data);
        } catch (err) {
            console.error("Failed to fetch history", err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (isOpen && token) {
            fetchHistory();
        }
    }, [isOpen, token, fetchHistory]);

    if (!isOpen) return null;

    return (
        <div className="history-panel glass-card animate-in-right">
            <div className="history-header">
                <h3><Clock size={18} /> Recent Code</h3>
                <button className="btn btn-ghost" style={{ padding: '8px' }} onClick={onClose}>
                    <X size={18} />
                </button>
            </div>

            <div className="history-list">
                {!token ? (
                    <div className="history-empty">
                        <p>Login to track history</p>
                    </div>
                ) : loading ? (
                    <div className="history-empty">
                        <div className="spinner-sm"></div>
                    </div>
                ) : history.length === 0 ? (
                    <div className="history-empty">
                        <p>No history yet</p>
                    </div>
                ) : (
                    history.map((item) => (
                        <div key={item._id} className="history-item" onClick={() => onSelect(item)}>
                            <div className="history-item-top">
                                <span className="lang-tag-sm">{item.language}</span>
                                <span className="history-date">{new Date(item.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="code-snippet-preview">
                                {item.code.substring(0, 60)}...
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default HistoryPanel;
