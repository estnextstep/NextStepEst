import {z} from "zod";
export const SignupSchema = z.object({
  role: z.enum(["student", "alumni"]),
  firstname: z.string().min(2, "First name is required"),
  lastname: z.string().min(2, "Last name is required"),
  username: z.string().min(2, "Username is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long")
});