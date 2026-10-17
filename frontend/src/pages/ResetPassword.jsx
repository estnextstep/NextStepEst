import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { InputOTPDemo } from "../components/ui/input-otp";
import { Link, useLocation } from "wouter";
import { GraduationCap } from "lucide-react";
import heroImage from "@assets/generated_images/students_collaborating_in_a_modern_library_setting.png";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { api } from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function ResetPassword() {
  const { toast } = useToast();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [time, setTime] = useState(2 * 60 * 1000);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const isValidEmail = email.includes("@") && email.includes(".");
  const [, navigate] = useLocation();
  const [otp, setOtp] = useState("");
  const { setResetData } = useAuth();

  // Send OTP mutation
  const sendOtpMutation = useMutation({
    mutationFn: () => api.post("/auth/reset-password", { email }),
    onSuccess: () => {
      setShow(true);
      setIsRunning(true);
      setTime(2 * 60 * 1000);

      toast({
        title: "Email sent",
        description: "Check your inbox for the OTP code",
      });
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: "Failed to send OTP",
        variant: "destructive",
      });
      
    },
  });
  const getOtpCode = () => {
    if (!isRunning) sendOtpMutation.mutate();
  };

  // Timer for resend OTP
  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1000) {
          clearInterval(intervalRef.current);
          setIsRunning(false);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  // Verify OTP
  const verifyOtpMutation = useMutation({
    mutationFn: async (otpValue) => {
      try {
        const response = await api.post("/auth/reset-password", {
          email,
          OTP: otpValue,
        });

        return response.data;
      } catch (error) {
        if (error.response) {
          throw new Error(error.response.data?.message || "OTP incorrect or expired");
        }
        throw new Error("Something went wrong");
      }
    },

    onSuccess: (data) => {
      const { reset_token, user_id } = data;

      setResetData({ reset_token, user_id });

      toast({
        title: "OTP Verified",
        description: "Redirecting to change password...",
      });

      navigate("/change-password");
    },

    onError: (error) => {
      toast({
        title: "Verification Failed",
        description: error.message,
        variant: "destructive",
      });
      
      
    },
  });

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
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

        <div className="relative z-10 h-full flex flex-col justify-between p-16 text-foreground">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl tracking-tight text-primary">
              Est Next Step
            </span>
          </div>

          <div className="max-w-lg">
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
                <div className="h-6 w-6 rounded-full bg-primary/30 flex items-center justify-center">
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
              Reset your password
            </h1>
          </div>

          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();

              if (!show) {
                toast({ title: "Send OTP first", variant: "destructive" });
                return;
              }

              const cleanOtp = otp.replace(/\D/g, "");

              if (cleanOtp.length !== 6) {
                toast({
                  title: "Incomplete Code",
                  description: "Please enter the full 6-digit code.",
                  variant: "destructive",
                });
                return;
              }

              verifyOtpMutation.mutate(cleanOtp);
            }}
          >
            <div className="grid gap-4">
              {/* Email + Send OTP */}
              <div className="grid grid-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex w-full">
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    id="email"
                    type="email"
                    placeholder="m.robinson@gmail.com"
                    className="flex-1 px-4 py-3 border rounded-l-md focus:outline-none focus:ring focus:ring-blue-500 bg-background"
                  />
                  <button
                    disabled={
                      !isValidEmail || isRunning || sendOtpMutation.isPending
                    }
                    onClick={getOtpCode}
                    type="button"
                    className="px-4 py-3 bg-primary text-white font-medium rounded-r-md hover:bg-primary/90 disabled:opacity-50"
                  >
                    {sendOtpMutation.isPending ? "Sending..." : "Send OTP"}
                  </button>
                </div>
              </div>

              {/* OTP input */}
              {show && (
                <div className="grid gap-2">
                  <Label htmlFor="otp">OTP</Label>
                  <InputOTPDemo value={otp} onChange={setOtp} />

                  {isRunning && (
                    <p className="text-sm text-blue-600">
                      You can resend OTP in {formatTime(time)}
                    </p>
                  )}
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={
                !show ||
                otp.replace(/\D/g, "").length !== 6 ||
                verifyOtpMutation.isPending
              }
              className="w-full py-6 text-base"
            >
              {verifyOtpMutation.isPending ? "Verifying..." : "Change Password"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            back to{" "}
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
