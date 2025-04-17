import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser, logout } from '@/features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            const role = localStorage.getItem('role');

            if (token && role) {
                setIsAuthenticated(true);
                setUserRole(role);
                dispatch(setUser({ role, token }));
            } else {
                setIsAuthenticated(false);
                setUserRole(null);
                dispatch(logout());
            }
            setIsLoading(false);
        };

        checkAuth();
    }, [dispatch]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        dispatch(logout());
        navigate('/login');
    };

    return {
        isLoading,
        isAuthenticated,
        userRole,
        handleLogout,
    };
}; 