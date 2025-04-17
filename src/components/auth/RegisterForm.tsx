
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  department: z.string().min(1, { message: "Please select a department." }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      department: "",
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    setIsLoading(true);
    console.log("Registration data:", data);
    
    // Simulate registration process
    setTimeout(() => {
      setIsLoading(false);
      navigate("/dashboard");
    }, 1000);
  };

  const handleMicrosoftRegister = () => {
    setIsLoading(true);
    console.log("Registering with Microsoft...");
    
    setTimeout(() => {
      setIsLoading(false);
      navigate("/dashboard");
    }, 1000);
  };

  const handleGoogleRegister = () => {
    setIsLoading(true);
    console.log("Registering with Google...");
    
    setTimeout(() => {
      setIsLoading(false);
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto">
      <div className="flex flex-col items-center mb-8">
        <div className="bg-primary/10 p-3 rounded-full mb-4">
          <Calendar className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
        <p className="text-gray-500 mt-2 text-center">
          Register to start managing your leave requests
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <Button
            onClick={handleMicrosoftRegister}
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
            {isLoading ? "Registering..." : "Register with Microsoft"}
          </Button>
          
          <Button
            onClick={handleGoogleRegister}
            disabled={isLoading}
            variant="outline"
            className="w-full py-2 px-4 rounded flex items-center justify-center gap-2"
          >
            <FcGoogle className="h-5 w-5" />
            {isLoading ? "Registering..." : "Register with Google"}
          </Button>
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">Or register with email</span>
          </div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="johndoe@company.com" {...field} />
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
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <Input placeholder="Engineering, HR, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default RegisterForm;
