const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
require("dotenv/config");
const port = process.env.PORT || 3000;

const salesRoutes = require("./routes/sale");
const authRoutes = require("./routes/auth");
const expenseRoutes = require("./routes/expense");
const connectDB = require("./db/connectDb");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.get("/", (req, res) => {
  res.json("Hello");
});

app.use("/auth", authRoutes);
app.use("/sale", salesRoutes);
app.use("/expense", expenseRoutes);

connectDB();
app.listen(port, () => {
  console.log(`Connection is live at port no. ${port}`);
});
