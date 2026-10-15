import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Link } from "wouter";
import { GraduationCap, User, Users } from "lucide-react";
import heroImage from "@assets/generated_images/students_collaborating_in_a_modern_library_setting.png";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
// zod form handler
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupSchema } from "../schemas/Signupschema";
// rest connection
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Createuser } from "../api/createuser";
// logo
import logo from "../logo.jpeg";

export default function Signup() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: Createuser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Account Created",
        description:
          "Your account has been successfully created. Please Confirm it.",
        duration: 2500,
      });
      setTimeout(() => {
        navigate("/login");
      }, 2600);
    },
    onError: (error) => {
      toast({
        title: "Signup Failed",
        description:
          error.response?.data?.message ||
          "An error occurred during signup. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    },
  });

  const form = useForm({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      role: "student",
      firstname: "",
      lastname: "",
      email: "",
      username: "",
      password: "",
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const handleSignup = (data) => {
    mutate(data);
  };
  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* Left Column - Image */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden bg-primary/20">
        <img
          src={heroImage}
          alt="Students collaborating"
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-linear-to-b from-primary/40 to-background/90" />

        <div className="relative z-10 h-full flex flex-col justify-between p-10 text-foreground">
          <div className="flex items-center ">
            {/* <GraduationCap className="h-8 w-8 text-primary" /> */}
            <img src={logo} alt="Est Next Step Logo" className="h-16 w-auto -mr-10" />
            <span className="font-bold text-xl mt-8 tracking-tight text-primary">
              Est Next Step
            </span>
          </div>

          <div className="max-w-lg mb-5">
            <h2 className="text-4xl font-bold mb-6">Join the community</h2>
            <ul className="space-y-4 text-lg text-foreground/80">
              <li className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/30 flex items-center justify-center">
                  ✓
                </div>
                Connect with 5,000+ alumni mentors
              </li>
              <li className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/30 flex items-center justify-center">
                  ✓
                </div>
                Access exclusive career resources
              </li>
              <li className="flex items-center gap-3">
                <div className="h-6 aw-6 rounded-full bg-primary/30 flex items-center justify-center">
                  ✓
                </div>
                Join discussion groups and forums
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 md:p-12 overflow-y-auto">
        <div className="w-full max-w-md space-y-8 py-8">
          <div className="lg:hidden mb-8">
            <Link href="/">
              <div className="inline-flex items-center gap-2 cursor-pointer">
                <GraduationCap className="h-8 w-8 text-primary" />
                <span className="font-bold text-xl tracking-tight text-primary">
                  Est Next Step
                </span>
              </div>
            </Link>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              Create an account
            </h1>
            <p className="text-muted-foreground mt-2">
              Start your journey with us today.
            </p>
          </div>

          <form
            className="space-y-6"
            onSubmit={form.handleSubmit(handleSignup)}
          >
            <div className="grid gap-2">
              <Label>I am a...</Label>
              <RadioGroup
                className="grid grid-cols-2 gap-4"
                value={form.watch("role")}
                onValueChange={(value) => form.setValue("role", value)}
              >
                <div>
                  <RadioGroupItem
                    value="student"
                    id="student"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="student"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-border bg-card p-4 hover:bg-secondary hover:text-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary cursor-pointer transition-all"
                  >
                    <User className="mb-3 h-6 w-6" />
                    Student
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="alumni"
                    id="alumni"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="alumni"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-border bg-card p-4 hover:bg-secondary hover:text-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary cursor-pointer transition-all"
                  >
                    <Users className="mb-3 h-6 w-6" />
                    Alumni
                  </Label>
                </div>
                {errors.role && (
                  <p className="text-sm text-red-500">{errors.role.message}</p>
                )}
              </RadioGroup>
            </div>

            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="first-name">First name</Label>
                  <Input
                    id="first-name"
                    placeholder="Max"
                    className="bg-background"
                    {...form.register("firstname")}
                  />
                  {errors.firstname && (
                    <p className="text-sm text-red-500">
                      {errors.firstname.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last-name">Last name</Label>
                  <Input
                    id="last-name"
                    placeholder="Robinson"
                    className="bg-background"
                    {...form.register("lastname")}
                  />
                  {errors.lastname && (
                    <p className="text-sm text-red-500">
                      {errors.lastname.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="username">username</Label>
                <Input
                  id="username"
                  type="username"
                  placeholder="maxrobinson"
                  className="bg-background"
                  {...form.register("username")}
                />
                {errors.username && (
                  <p className="text-sm text-red-500">{errors.username.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m.robinson@gmail.com"
                  className="bg-background"
                  {...form.register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  className="bg-background"
                  {...form.register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full py-6 text-base">
              {isPending ? "Creating..." : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login">
              <span className="font-semibold text-primary hover:underline cursor-pointer">
                Log in
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
