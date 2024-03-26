const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name) res.json("Please enter a valid name");
    if (!email) res.json("Please enter a valid email");
    if (!password) res.json("Please enter a valid password");

    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({ message: "User already exists." });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashPassword,
      status: "Pending",
    });

    const savedUser = await newUser.save();

    // sendConfirmationEmailToAdmin(name, email);

    res.status(201).json({
      savedUser,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Cannot register user. Please try again." });
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found");
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log("User found:", user);

    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", passwordMatch);

    if (!passwordMatch) {
      console.log("Password does not match");
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "12h",
    });
    const twelveHoursInMilliseconds = 12 * 60 * 60 * 1000;
    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: twelveHoursInMilliseconds,
        secure: true,
        domain: "localhost",

        path: "/",
      })
      .json({ message: "Login successful" });

    console.log("Login successful");
    // res.;
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { registerUser, signin };
