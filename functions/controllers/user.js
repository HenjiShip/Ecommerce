const { client } = require("../util/client.js");

const login = async (req, res) => {
  try {
    const { name, picture } = req.userAuth;
    res.json({ name, picture });
  } catch (error) {
    console.log({ message: "login error" });
  }
};

const logout = async (req, res) => {
  try {
    await res.cookie("userInfo", "", { maxAge: 0 });
    res.sendStatus(200);
  } catch (error) {
    console.log("error at logout");
  }
};

const updateCart = async (req, res) => {
  try {
    const cartInfo = req.body;
    const { cartItems } = cartInfo;
    const currentUserId = req.userInfo.userId;

    // Fetch all carts that belong to the current user
    const carts = await client.fetch(
      `*[_type == "carts" && userId == $userId]`,
      { userId: currentUserId }
    );

    // Loop through the carts and update each one
    for (const cart of carts) {
      const { _id } = cart;

      // Update the cart document with the new cart items, total price, and total quantities
      await client.patch(_id).set({ cartItems }).commit();
    }
    res.sendStatus(200);
  } catch (error) {
    console.log({ message: "error at updateCart" });
  }
};

const getUserCart = async (req, res) => {
  try {
    const currentUserId = req.userInfo.userId;
    if (currentUserId) {
      const carts = await client.fetch(
        `*[_type == "carts" && userId == $userId]`,
        {
          userId: currentUserId,
          force: true,
        }
      );
      res.json(carts);
    } else {
      res.status(404).json({ message: "User is not logged in" });
    }
  } catch (error) {
    console.log({ message: "Failed to getUserCart" });
  }
};
// const currentUserId = req.userInfo.userId;
// const carts = await client.fetch(`*[_type == "carts" && userId == $userId]`, {
//   userId: currentUserId,
// });
// const cartItems = carts[0].cartItems;
// res.json(cartItems);

module.exports = { login, logout, updateCart, getUserCart };
