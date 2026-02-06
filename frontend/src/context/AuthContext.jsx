import { createContext, useState, useEffect, useContext } from 'react';

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

    const login = (userData, token) => {
        // Save to localStorage
        localStorage.setItem('userInfo', JSON.stringify(userData));
        localStorage.setItem('userToken', token);

        // Update state
        setUser(userData);
    };

    const logout = () => {
        // Clear localStorage
        localStorage.removeItem('userInfo');
        localStorage.removeItem('userToken');

        // Update state
        setUser(null);
    };

    const isAuthenticated = () => {
        return !!user;
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthContext;
