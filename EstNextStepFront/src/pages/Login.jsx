import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";
import { GraduationCap, Mail,Eye,EyeOff } from "lucide-react";

import heroImage from "@assets/generated_images/imageee.png";
import { useState } from "react";
// zod login handler
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "../schemas/LoginSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUser } from "../api/login";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
// image
import logo from "../logo.jpeg";
import { useAuth } from "../context/AuthContext";


export default function Login() {
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const { login } = useAuth();
  const { mutate, isPending } = useMutation({
      mutationFn: loginUser,
      onSuccess: (data) => {
      login(data);
  console.log(data);

  toast({
    title: "Login successful",
    description: "You have been successfully logged in.",
    duration: 2000,
  });

  setTimeout(() => {
    navigate("/");
  }, 2600);
},

      onError: (error) => {
        toast({
          title: "login Failed",
          description:
            error.response?.data?.message ||
            "An error occurred during login. Please try again.",
          variant: "destructive",
          duration: 3000,
        });
      },
    });
  
   const togglepasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  }

  const handleLogin = (data) => {
     mutate(data);
    
  }
  const form=useForm({
    resolver:zodResolver(LoginSchema),
    defaultValues:{
      email:"",
      password:"",
    }
  })
const {
  
  handleSubmit,
  formState: { errors },
} = form;
  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* Left Column - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <Link href="/">
              <div className="inline-flex items-center gap-2 mb-8 cursor-pointer">
                {/* <GraduationCap className="h-8 w-8 text-primary" /> */}
                <img src={logo} alt="Est Next Step Logo" className="h-12 w-auto -mr-10" />
                <span className="font-bold text-xl mt-5 tracking-tight text-primary">Est Next Step</span>
              </div>
            </Link>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground mt-2">Enter your credentials to access your account.</p>
          </div>

          <div className="grid gap-6">
            <form className="space-y-4" onSubmit={form.handleSubmit(handleLogin)}>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" {...form.register("email")} type="email" placeholder="m@example.com" className="bg-background" />
              {errors.email &&(
                    <p className="text-sm text-red-500">
    {errors.email.message}
  </p>
                  )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="/reset-password" className="text-sm font-medium text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Input id="password" {...form.register("password")} type={showPassword ? "text" : "password"} className="bg-background pr-10" />
                  <button
                    type="button"
                    onClick={togglepasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              {errors.password &&(
                    <p className="text-sm text-red-500">
    {errors.password.message}
  </p>
                  )}
              </div>
              {/* <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground"
                >
                  Remember me for 30 days
                </label>
              </div> */}
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

           
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup">
              <span className="font-semibold text-primary hover:underline cursor-pointer">Sign up</span>
            </Link>
          </p>
        </div>
      </div>

      {/* Right Column - Image */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden bg-primary/20">
        <img 
          src={heroImage} 
          alt="Students networking" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent" />
        
        <div className="relative z-10 h-full flex flex-col justify-end p-16 text-foreground">
          <blockquote className="space-y-6 max-w-lg">
            <p className="text-2xl font-medium leading-relaxed">
              "Connecting with my mentor through UniConnect was the turning point in my career. The guidance I received was invaluable."
            </p>
            <footer className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50">
                <span className="font-bold text-sm">SC</span>
              </div>
              <div>
                <p className="font-semibold">Sarah Chen</p>
                <p className="text-sm text-muted-foreground">Software Engineer at Tech Giant</p>
              </div>
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
