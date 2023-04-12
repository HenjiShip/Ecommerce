import "../styles/globals.css";
import React from "react";
import { Toaster } from "react-hot-toast";

import { Layout } from "../components";
import { StateContext } from "../context/StateContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function App({ Component, pageProps }) {
  return (
    <GoogleOAuthProvider
      clientId={`${process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_AUTH_CLIENT_ID}`}
    >
      <StateContext>
        <Layout>
          <Toaster />
          <Component {...pageProps} />
        </Layout>
      </StateContext>
    </GoogleOAuthProvider>
  );
}
