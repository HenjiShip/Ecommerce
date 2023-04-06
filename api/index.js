import axios from "axios";

export const API = axios.create({
  baseURL: "http://localhost:8888/.netlify/functions/api",
});

export const fetchPost = () => API.get("/users");

export const login = () => API.post("/users");
