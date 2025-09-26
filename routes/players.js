const express = require("express");
const router = express.Router();
const Player = require("../models/playerModel");
const mongoose = require("mongoose");

// Default sample players
const samplePlayers = [
  { name: "Jordan Love", number: 10, position: "Quarterback" },
  { name: "Aaron Jones", number: 33, position: "Running Back" },
  { name: "Christian Watson", number: 9, position: "Wide Receiver" },
  { name: "Rashan Gary", number: 52, position: "Linebacker" },
  { name: "Jaire Alexander", number: 23, position: "Cornerback" }
];

// POST new player
router.post("/", async (req, res) => {
  const { name, number, position } = req.body;
  try {
    const player = await Player.create({ name, number, position });
    res.status(201).json(player);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET all players (auto-seeds if DB empty)
router.get("/", async (req, res) => {
  try {
    let players = await Player.find();
    if (players.length === 0) {
      // Seed sample data if empty
      players = await Player.insertMany(samplePlayers);
      console.log("🌱 Database seeded with sample players!");
    }
    res.status(200).json(players);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch players" });
  }
});

// GET a player by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Player not found" });
  }
  const player = await Player.findById(id);
  if (!player) {
    return res.status(404).json({ error: "Player not found" });
  }
  res.status(200).json(player);
});

// PATCH update player
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Player not found" });
  }
  const player = await Player.findOneAndUpdate({ _id: id }, { ...req.body }, { new: true });
  if (!player) {
    return res.status(404).json({ error: "Player not found" });
  }
  res.status(200).json(player);
});

// DELETE player
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Player not found" });
  }
  const player = await Player.findOneAndDelete({ _id: id });
  if (!player) {
    return res.status(404).json({ error: "Player not found" });
  }
  res.status(200).json({ message: "Player deleted", deleted: player });
});

module.exports = router;
