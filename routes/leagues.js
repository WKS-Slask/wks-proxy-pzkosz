const express = require("express");

const LeaguesController = require("../controllers/LeaguesController");
const router = express.Router();

router.get("/", async (req, res) => {
  const leagues = new LeaguesController();
  await leagues.get(req, res);
});

module.exports = router;
