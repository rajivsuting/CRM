const express = require("express");
const router = express.Router();
const auth = require("../middleware/authenticateToken");
const Sale = require("../models/Sale");
const { DateTime } = require("luxon");

// @route   GET api/sales
// router.get("/", auth, async (req, res) => {
//   try {
//     const sales = await Sale.find({ user: req.user.id }).sort({ date: -1 });
//     res.json(sales);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

router.get("/", auth, async (req, res) => {
  try {
    const { interval } = req.query;
    let startDate;

    switch (interval) {
      case "today":
        startDate = DateTime.local().startOf("day");
        break;
      case "last3days":
        startDate = DateTime.local().minus({ days: 2 }).startOf("day");
        break;
      case "currentWeek":
        startDate = DateTime.local().startOf("week");
        break;
      case "currentMonth":
        startDate = DateTime.local().startOf("month");
        break;
      case "last3Months":
        startDate = DateTime.local().minus({ months: 2 }).startOf("month");
        break;
      case "last6Months":
        startDate = DateTime.local().minus({ months: 5 }).startOf("month");
        break;
      case "currentYear":
        startDate = DateTime.local().startOf("year");
        break;
      default:
        return res.status(400).json({ message: "Invalid interval provided" });
    }

    const sales = await Sale.find({
      user: req.user.id,
      date: { $gte: startDate.toJSDate() },
    }).sort({ date: -1 });

    res.json(sales);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   POST api/sales

router.post("/", auth, async (req, res) => {
  const { category, amount } = req.body;

  try {
    const newSale = new Sale({
      category,
      amount,
      user: req.user.id,
    });

    const sale = await newSale.save();
    res.json(sale);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   DELETE api/sales/:id
router.delete("/:id", auth, async (req, res) => {
  try {
    let sale = await Sale.findById(req.params.id);

    if (!sale) return res.status(404).json({ msg: "Sale not found" });

    if (sale.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    await sale.remove();
    res.json({ msg: "Sale removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
