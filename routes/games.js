const express = require("express");

const UpcomingGamesController = require("../controllers/UpcomingGamesController");

const router = express.Router();

router.get("/", async (req, res) => {
  const upcomingGames = new UpcomingGamesController();
  await upcomingGames.get(req, res);
});

module.exports = router;
