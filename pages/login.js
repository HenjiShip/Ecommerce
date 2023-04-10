import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { API } from "../api";
import * as api from "../api/index.js";
import { useRouter } from "next/router";

const loginUser = async () => {
  await localStorage.clear();
  const { data } = await api.login();
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const userData = { data, exp };
  await localStorage.setItem("user", JSON.stringify(userData));
};

const Login = () => {
  const router = useRouter();

  const googleSuccess = async (res) => {
    try {
      const token = res.credential;
      API.defaults.headers.common["Authorization"] = await `Bearer ${token}`;
      loginUser();
      // get name and profile image from login response and add it to local storage
      await router.push("/");
      router.reload();
    } catch (error) {
      console.log(error);
    }
  };
  const googleFailure = (error) => {
    console.log("Google Signin Unsuccessful");
  };
  return <GoogleLogin onSuccess={googleSuccess} onFailure={googleFailure} />;
};

export default Login;
