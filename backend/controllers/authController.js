const User = require("../models/User.js");
const jwt = require("jsonwebtoken");

/* Generate JWT */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

/* Register */
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, rollNumber, branch, batch } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      rollNumber,
      branch,
      batch,
    });

    res.status(201).json({
      token: generateToken(user._id),
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

/* Login */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    //console.log("emial",email);
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    //console.log("user",user.password);
    const isMatch = user.password===password;
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      token: generateToken(user._id),
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

