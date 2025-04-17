
import { Helmet } from "react-helmet";
import LoginForm from "@/components/auth/LoginForm";

const Login = () => {
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
