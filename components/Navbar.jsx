import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { AiOutlineShopping } from "react-icons/ai";
import { Cart } from "./";
import { useStateContext } from "../context/StateContext";

const Navbar = () => {
  const router = useRouter();
  const {
    showCart,
    setShowCart,
    totalQuantities,
    logout,
    user,
  } = useStateContext();

  useEffect(async () => {
    if (user && Date.now() > user.expire) {
      localStorage.removeItem("user");
    }
  }, [router.pathname]);

  return (
    <div className="navbar-container">
      <p className="logo">
        <Link href="/">Drizco Store</Link>
      </p>
      <div>
        <button
          type="button"
          className="cart-icon"
          onClick={() => setShowCart(true)}
        >
          <AiOutlineShopping />
          <span className="cart-item-qty">{totalQuantities}</span>
        </button>
        {user ? (
          <button type="button" onClick={() => logout()}>
            Logout
          </button>
        ) : (
          <Link href="/login">
            <button type="button">Login</button>
          </Link>
        )}
      </div>

      {showCart && <Cart />}
    </div>
  );
};

export default Navbar;
