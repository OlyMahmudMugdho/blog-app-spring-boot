'use client';

import { createContext, useContext, useState, useEffect } from 'react';

type AuthContextType = {
    user: any;
    login: (token: string) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            // Fetch user profile here
        }
    }, []);

    const login = (token: string) => {
        localStorage.setItem('authToken', token);
        // Fetch user profile and set state
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}