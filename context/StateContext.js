import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import * as api from "../api/index.js";

const Context = createContext();

export const StateContext = ({ children }) => {
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantities, setTotalQuantities] = useState(0);
  const [user, setUser] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setCartItems(JSON.parse(localStorage.getItem("cartItems")) || []);
    setTotalQuantities(
      JSON.parse(localStorage.getItem("totalQuantities")) || 0
    );
    setTotalPrice(JSON.parse(localStorage.getItem("totalPrice")) || 0);
  }, []);

  const updateCart = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const cartInfo = {
      cartItems: JSON.parse(localStorage.getItem("cartItems")) || [],
      totalPrice: JSON.parse(localStorage.getItem("totalQuantities")) || 0,
      totalQuantities: JSON.parse(localStorage.getItem("totalPrice")) || 0,
    };

    if (user) {
      const { data } = await api.updateCart(cartInfo);
    }
  };

  // const getUserCart = async () => {
  //   const { data } = await api.getUserCart();
  // };

  const persistCartItems = () => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    localStorage.setItem("totalPrice", JSON.stringify(totalPrice));
    localStorage.setItem("totalQuantities", JSON.stringify(totalQuantities));
    // if user has items in cart while logged out, and then logs in, user's logged out items get added to their accounts cart. so i should add the local storage items to the serverside cart if the item ids match
    // if use has items in cart and logs out, it clears the cart.
  };

  useEffect(() => {
    persistCartItems();
    updateCart();
  }, [cartItems]);

  const onAdd = async (product, quantity) => {
    const checkProductInCart = cartItems.find(
      (item) => item._id === product._id
    );
    setTotalPrice(
      (prevTotalPrice) => prevTotalPrice + product.price * quantity
    );
    setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);
    if (checkProductInCart) {
      const updatedCartItems = cartItems.map((cartProduct) => {
        if (cartProduct._id === product._id) {
          return { ...cartProduct, quantity: cartProduct.quantity + quantity };
        } else {
          return cartProduct;
        }
      });
      setCartItems(updatedCartItems);
    } else {
      product.quantity = quantity;
      setCartItems([...cartItems, { ...product }]);
    }
    toast.success(`${qty} ${product.name} added to cart.`);
  };

  // const onAdd = async (product, quantity) => {
  //   const checkProductInCart = cartItems.find(
  //     (item) => item._id === product._id
  //   );
  //   const updatedCartItems = checkProductInCart
  //     ? cartItems.map((cartProduct) =>
  //         cartProduct._id === product._id
  //           ? { ...cartProduct, quantity: cartProduct.quantity + quantity }
  //           : cartProduct
  //       )
  //     : [...cartItems, { ...product, quantity }];
  //   setCartItems(updatedCartItems);
  //   setTotalPrice(
  //     (prevTotalPrice) => prevTotalPrice + product.price * quantity
  //   );
  //   setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);
  //   toast.success(`${quantity} ${product.name} added to cart.`);
  // };

  
  const toggleCartItemQuantity = (id, value) => {
    const updatedCartItems = cartItems.map((item) => {
      if (item._id === id) {
        return {
          ...item,
          quantity: value === "inc" ? item.quantity + 1 : item.quantity - 1,
        };
      }
      return item;
    });

    setCartItems(updatedCartItems);

    const foundProduct = cartItems.find((item) => item._id === id);
    if (value === "inc") {
      setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price);
      setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1);
    } else if (value === "dec") {
      setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price);
      setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - 1);
    }
  };

  const incQty = () => {
    setQty((prevQty) => prevQty + 1);
  };
  const decQty = () => {
    setQty((prevQty) => {
      if (prevQty - 1 < 1) return 1;
      return prevQty - 1;
    });
  };

  const logout = () => {
    localStorage.clear("user");
    api.logout();
    console.log("i ran");
    setUser(null);
  };

  const login = async () => {
    const { data } = await api.login();
    const exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
    const userData = { data, exp };
    localStorage.setItem("user", JSON.stringify(userData));
  };

  return (
    <Context.Provider
      value={{
        showCart,
        cartItems,
        totalPrice,
        totalQuantities,
        qty,
        user,
        setQty,
        incQty,
        decQty,
        onAdd,
        setShowCart,
        toggleCartItemQuantity,
        login,
        logout,
        setUser,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
