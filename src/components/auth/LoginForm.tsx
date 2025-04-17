import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import RegisterForm from "./RegisterForm";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from "../ui/form";
import { useLoginMutation } from "@/features/api/authApi";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { useActions } from "@/hooks/use-action";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
})
type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const navigate = useNavigate();
  const [login, { isLoading, error, status }] = useLoginMutation();
  const [loginErrors, setLoginErrors] = useState(null);
  const { setUser } = useActions();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const handleMicrosoftLogin = () => {
    // This would connect to Microsoft Authentication API
    console.log("Logging in with Microsoft...");
  };

  const handleGoogleLogin = () => {
    // This would connect to Google Authentication API
    console.log("Logging in with Google...");
  };

  const handleLogin = async (data: LoginFormValues) => {
    if (isLoading) return;
    const payload = {
      email: data.email as string,
      password: data.password as string
    }
    setLoginErrors(null);
    login(payload).unwrap()
      .then(data => {
        if (data?.success) {
          const role = data?.access_token?.role;

          setUser({
            role: data.access_token.role.toLowerCase(),
            token: data?.access_token?.token,
          });
          localStorage.setItem('token', data?.access_token?.token);
          localStorage.setItem('role', role.toLowerCase())

          if (role.toLowerCase() === 'admin') {
            navigate('/admin')
          }
        }
      }).catch(erro => {
        setLoginErrors(erro)
        if (erro?.status == 401) {
          toast({
            title: "Error",
            description: erro?.data?.message,
            variant: "destructive",
          });
          return;
        }
      }
      );



  };

  return (
    <Tabs defaultValue="login" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="register">Register</TabsTrigger>
      </TabsList>

      <TabsContent value="login">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <Calendar className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome to LeaveFlow</h1>
            <p className="text-gray-500 mt-2 text-center">
              Sign in to manage your leave requests and view your balances
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={handleMicrosoftLogin}
              disabled={isLoading}
              className="w-full bg-[#2f2f2f] hover:bg-[#1f1f1f] text-white py-2 px-4 rounded flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 23 23"
                fill="none"
              >
                <path d="M11 11H0V0H11V11Z" fill="#F1511B" />
                <path d="M23 11H12V0H23V11Z" fill="#80CC28" />
                <path d="M11 23H0V12H11V23Z" fill="#00ADEF" />
                <path d="M23 23H12V12H23V23Z" fill="#FBBC09" />
              </svg>
              {isLoading ? "Signing in..." : "Sign in with Microsoft"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="example@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Your Password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {loginErrors && loginErrors?.status === 401 && (
                  <div className="text-red-500 text-sm text-center">
                    {'message' in loginErrors?.data ? loginErrors.data.message : 'An error occurred'}
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            </Form>
          </div>

          <div className="mt-8 text-sm text-center text-gray-500">
            <p>
              This application integrates with your company's Microsoft or Login for
              secure authentication.
            </p>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="register">
        <RegisterForm />
      </TabsContent>
    </Tabs>
  );
};

export default LoginForm;
