import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useActions } from './use-action';
export const useAuth = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);
    const { logout, setUser } = useActions();
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            const role = localStorage.getItem('role');

            if (token && role) {
                setIsAuthenticated(true);
                setUserRole(role);
                setUser({ role, token });
            } else {
                setIsAuthenticated(false);
                setUserRole(null);
                logout();
            }
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        logout();
        setIsAuthenticated(false);
        setUserRole(null);
        navigate('/login');
    };

    return {
        isLoading,
        isAuthenticated,
        userRole,
        handleLogout,
    };
}; 