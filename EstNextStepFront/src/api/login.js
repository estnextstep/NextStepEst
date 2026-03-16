import { api } from "./api";
export const loginUser=async(userData)=>{
    const {data}=await api.post("/auth/login",userData);
    return data;
}