import axios from 'axios'

const chatApiInstance = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/chats`,
    withCredentials: true
})

export const invokeChat = async ({ input }) => {
    const response = await chatApiInstance.post("/invoke", {input})

    return response.data
}

export const getChats = async () => {
  const response = await chatApiInstance.get("/");

  return response.data;
};

export const deleteChat = async (id) => {
  const response = await chatApiInstance.delete(`/${id}`);

  return response.data;
};