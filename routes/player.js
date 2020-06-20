const express = require("express");

const PlayerController = require("../controllers/PlayerController");

const router = express.Router();

router.get("/:id", async (req, res) => {
  const player = new PlayerController(req.params.id);
  await player.get(req, res);
});

module.exports = router;
