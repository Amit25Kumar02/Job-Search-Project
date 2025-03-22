const express = require("express");
const router = express.Router();
const User = require("../models/userSchema");

// Add to favorites
router.post("/add", async (req, res) => {
  const { userId, itemId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user.favorites.includes(itemId)) {
      user.favorites.push(itemId);
      await user.save();
    }
    res.json({ success: true, message: "Item added to favorites!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Remove from favorites
router.post("/remove", async (req, res) => {
  const { userId, itemId } = req.body;

  try {
    const user = await User.findById(userId);
    user.favorites = user.favorites.filter((fav) => fav.toString() !== itemId);
    await user.save();
    res.json({ success: true, message: "Item removed from favorites!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get user's favorites
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("favorites");
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
