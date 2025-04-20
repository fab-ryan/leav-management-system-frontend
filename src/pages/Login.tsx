
import { Helmet } from "react-helmet";
import LoginForm from "@/components/auth/LoginForm";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useLazyUserProfileQuery, useUserProfileQuery } from "@/features/api/authApi";
import { useActions, useSelector } from "@/hooks/use-action";
const Login = () => {
  const { setUser } = useActions();
  const { profileCompleted, user } = useSelector(state => state.auth);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const error = searchParams.get("error");
  const token = searchParams.get("token");
  const role = searchParams.get("role");
  const navigate = useNavigate();
  const { data: userProfile, isLoading, error: userProfileError, refetch }
    = useUserProfileQuery();

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error,
        duration: 5000,
        variant: 'destructive',
      });
      navigate('/login');
    }
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('role', role?.toLowerCase() || '');
      if (role.toLowerCase() === 'admin') {
        navigate('/admin')
      }
      if (role.toLowerCase() === 'employee') {
        navigate('/dashboard')
      }
      if (role.toLowerCase() === 'manager') {
        navigate('/manager')
      }
      if (role.toLowerCase() === 'hr') {
        navigate('/hr')
      }
    }
  }, [
    error, token, role, navigate
  ])




  return (
    <>
      <Helmet>
        <title>Login - LeaveFlow</title>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </>
  );
};

export default Login;
