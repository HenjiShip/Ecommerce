import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { API } from "../api";
import { useStateContext } from "../context/StateContext";
import { useRouter } from "next/router";

const login = () => {
  const { login } = useStateContext();
  const router = useRouter();

  const googleSuccess = async (res) => {
    try {
      const token = res.credential;
      API.defaults.headers.common["Authorization"] = await `Bearer ${token}`;
      login();
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };
  const googleFailure = (error) => {
    console.log("Google Signin Unsuccessful");
  };
  return <GoogleLogin onSuccess={googleSuccess} onFailure={googleFailure} />;
};

export default login;
