import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            // In a real app, you'd verify the token or fetch user profile here
            setUser({ username: localStorage.getItem('username') });
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            setUser(null);
        }
    }, [token]);

    const login = (newToken, username) => {
        setToken(newToken);
        localStorage.setItem('username', username);
        setUser({ username });
    };

    const logout = () => {
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
