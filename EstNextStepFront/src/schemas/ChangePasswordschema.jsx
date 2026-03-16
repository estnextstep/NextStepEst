import z from "zod";
export const ChangepasswordSchema = z.object({ 
    newPassword: z.string().min(8, "New password must be at least 8 characters long"),
    confirmNewPassword: z.string().min(8, "Please confirm your new password"),
  }).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "passwords do not match",
path: ["confirmNewPassword"],
});