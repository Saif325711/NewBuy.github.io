import { createContext, useState, useEffect, useContext } from 'react';
import { register as registerService, login as loginService, logout as logoutService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored user data on mount
        const storedUser = localStorage.getItem('userInfo');
        const storedToken = localStorage.getItem('userToken');

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const data = await loginService({ email, password });
        setUser(data);
        return data;
    };

    const register = async (name, email, password) => {
        const data = await registerService({ name, email, password });
        setUser(data);
        return data;
    };

    const logout = () => {
        logoutService();
        setUser(null);
    };

    const isAuthenticated = () => {
        return !!user;
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthContext;
