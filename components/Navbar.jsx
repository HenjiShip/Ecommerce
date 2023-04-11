import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { AiOutlineShopping } from "react-icons/ai";
import { Cart } from "./";
import { useStateContext } from "../context/StateContext";

const Navbar = () => {
  const router = useRouter();
  const { showCart, setShowCart, totalQuantities, logout, user } =
    useStateContext();

  console.log(user);

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
      <div style={{ display: "flex", flexDirection: "row" }}>
        <button
          type="button"
          className="cart-icon"
          onClick={() => setShowCart(true)}
        >
          <AiOutlineShopping />
          <span className="cart-item-qty">{totalQuantities}</span>
        </button>
        {user ? (
          <button
            type="button"
            style={{
              display: "flex",
              alignItems: "center",
              padding: "3px 10px",
              border: "1px solid #f02d34",
              fontSize: "19px",
              fontWeight: "500",
              backgroundColor: "white",
              color: "#f02d34",
              cursor: "pointer",
              width: "200px",
              transform: "scale(1, 1)",
              transition: "transform 0.5s ease",
            }}
            onClick={() => logout()}
          >
            <img
              src={user?.picture}
              style={{
                width: "30px",
                borderRadius: "30px",
                marginRight: "10px",
              }}
            />
            <h6 style={{ margin: "0" }}>{user?.name}</h6>
            <span style={{ marginLeft: "10px" }}>Logout</span>
          </button>
        ) : (
          <Link href="/login">
            <button
              type="button"
              style={{
                padding: "3px 10px",
                border: "1px solid #f02d34",
                fontSize: "19px",
                fontWeight: "500",
                backgroundColor: "white",
                color: "#f02d34",
                cursor: "pointer",
                width: "100px",
                transform: "scale(1, 1)",
                transition: "transform 0.5s ease",
              }}
            >
              Login
            </button>
          </Link>
        )}
      </div>

      {showCart && <Cart />}
    </div>
  );
};

export default Navbar;
