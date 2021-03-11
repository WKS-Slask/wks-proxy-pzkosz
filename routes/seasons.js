const express = require("express");

const SeasonsController = require("../controllers/SeasonsController");
const router = express.Router();

router.get("/", async (req, res) => {
  const seasons = new SeasonsController();
  await seasons.get(req, res);
});

module.exports = router;
