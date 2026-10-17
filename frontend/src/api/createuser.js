import { api } from "./api"

export const Createuser=async(userData)=>{
    const {data}=await api.post("/auth/register",userData);
    return data;
}