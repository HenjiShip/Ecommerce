import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router.js";
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

  const router = useRouter();

  useEffect(async () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      await setUser(userData.data);
      await getUserCart();
    }

    const cartItems = localStorage.getItem("cartItems");
    await setCartItems(
      cartItems && cartItems !== "undefined" ? JSON.parse(cartItems) : []
    );
  }, []);

  const calculateTotalQuantityAndPrice = () => {
    const cartCopy = JSON.parse(localStorage.getItem("cartItems"));
    let totalQuantity = 0;
    let totalPrice = 0;
    {
      cartCopy.map((item) => {
        totalQuantity = totalQuantity + item.quantity;
        totalPrice = totalPrice + item.quantity * item.price;
      });
    }
    setTotalQuantities(totalQuantity);
    setTotalPrice(totalPrice);
    localStorage.setItem("totalQuantities", JSON.stringify(totalQuantity));
    localStorage.setItem("totalPrice", JSON.stringify(totalPrice));
  };

  const getUserCart = async () => {
    const { data } = await api.getUserCart();
    const { cartItems } = data[0];

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  };

  const updateCart = async () => {
    const cartInfo = {
      cartItems: JSON.parse(localStorage.getItem("cartItems")),
    };

    if (user) {
      const { data } = await api.updateCart(cartInfo);
    }
  };

  const persistCartItems = () => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    // localStorage.setItem("totalPrice", JSON.stringify(totalPrice));
    // localStorage.setItem("totalQuantities", JSON.stringify(totalQuantities));

    // How Amazon works
    // if user has items in cart while logged out, and then logs in, user's logged out items get added to their accounts cart. so i should add the local storage items to the serverside cart if the item ids match
    // if user has items in cart and logs out, it clears the cart.
  };

  useEffect(() => {
    persistCartItems();
    updateCart();
    calculateTotalQuantityAndPrice();
  }, [cartItems]);

  const onAdd = async (product, quantity) => {
    const checkProductInCart = cartItems.find(
      (item) => item._id === product._id
    );

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

  const toggleCartItemQuantity = (id, value) => {
    const updatedCartItems = cartItems.map((item) => {
      if (item._id === id) {
        return {
          ...item,
          quantity:
            value === "inc"
              ? item.quantity + 1
              : item.quantity > 1
              ? item.quantity - 1
              : (item.quantity = 1),
        };
      }
      return item;
    });

    setCartItems(updatedCartItems);
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
    setUser(null);
    router.reload();
  };

  // temporarily clearing cart here because i don't feel like adding a logged out user's cart to their cart when they log in yet
  // to do this though, i would just compare the logged out user's cart to see if any id's match and add to quantity if it does and just add the items if they dont

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
        logout,
        setUser,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
