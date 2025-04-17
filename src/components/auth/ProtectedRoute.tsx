import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '@/features/auth/authSlice';
import { Loader2 } from 'lucide-react';

type UserRole = 'staff' | 'manager' | 'admin' | 'employee';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState<UserRole | null>(null);
    const location = useLocation();
    const user = useSelector(selectUser);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            const role = localStorage.getItem('role') as UserRole | null;

            if (token && role) {
                setIsAuthenticated(true);
                setUserRole(role);
            } else {
                setIsAuthenticated(false);
                setUserRole(null);
            }
            setIsLoading(false);
        };

        checkAuth();
    }, [user]);

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
        // Redirect to appropriate dashboard based on role
        let redirectPath = '/dashboard';
        if (userRole === 'admin') {
            redirectPath = '/admin';
        } else if (userRole === 'manager') {
            redirectPath = '/manager';
        }
        return <Navigate to={redirectPath} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute; 