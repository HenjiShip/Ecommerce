const userTest = async (req, res) => {
  res.json("Hello World");
};

const login = async (req, res) => {
  res.json("logged in!");
};

module.exports = { userTest, login };
