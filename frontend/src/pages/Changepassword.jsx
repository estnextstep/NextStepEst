import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangepasswordSchema } from "../schemas/ChangePasswordschema";
import { useMutation } from "@tanstack/react-query";
import { api } from "../api/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function ChangePassword() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const { resetData, setResetData } = useAuth();
  const reset_token = resetData?.reset_token;
  const user_id = resetData?.user_id;

  useEffect(() => {
    if (!resetData) {
      navigate("/reset-password");
    }
  }, [resetData, navigate]);

  const form = useForm({
    resolver: zodResolver(ChangepasswordSchema),
    defaultValues: { newPassword: "", confirmNewPassword: "" },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data) =>
      api.post("/auth/change-password", {
        user_id,
        reset_token,
        new_password: data.newPassword,
        confirm_password: data.confirmNewPassword,
      }),
    onSuccess: () => {
      toast({
        title: "Password changed",
        description: "You can now login with your new password",
      });
      setResetData(null);
      navigate("/login");
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Failed to change password",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data) => changePasswordMutation.mutate(data);

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <h4 className="text-xl font-serif font-bold text-[#2A3B5F] dark:text-white mb-6">
        Reset Password
      </h4>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label>New Password</Label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-3 border rounded focus:outline-none focus:ring focus:ring-blue-500 bg-background dark:bg-gray-800 text-foreground"
            {...form.register("newPassword")}
          />
        </div>
        <div className="space-y-2">
          <Label>Confirm Password</Label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-3 border rounded focus:outline-none focus:ring focus:ring-blue-500 bg-background dark:bg-gray-800 text-foreground"
            {...form.register("confirmNewPassword")}
          />
        </div>
        <Button
          type="submit"
          className="bg-[#2A3B5F] text-white w-full mt-4 shadow-lg shadow-[#2A3B5F]/20"
        >
          Change Password
        </Button>
      </form>
    </div>
  );
}