import axios from "axios";

export const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_NETLIFY_API,
  headers: {
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
  },
});
// setting the header to access the server itself here so that any request made will set the key header for this website

export const login = () => API.post("/users");
export const logout = () => API.delete("/users");
export const updateCart = (cartInfo) => API.post("/users/cart", cartInfo);
export const getUserCart = () => API.get("users/cart");
