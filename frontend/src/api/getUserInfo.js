import { api } from "./api";
export const getProfil=async()=>{
    const {data}=await api.get(`/me`);
    return data;
}
export const getUserProfile = async (username) => {
  const { data } = await api.get(`/profile/${username}`);
  return data;
}
export const getUserQuestion = async (userId, page = 0) => {
  const { data } = await api.get("/user/questions", {
    params: {
      user_id: userId,
      page: page,
    },
  });

  return data;
};
// export const getQuestionsByUsername= async (username, page = 0) => {
//   const { data } = await api.get("/user/questions/", {
//     params: {
//       username: username,
//       page: page,
//     },
//   });

//   return data;
// };