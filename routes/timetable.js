const express = require("express");
const TimetableController = require("../controllers/TimetableController");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const timetable = new TimetableController(req.query);
    await timetable.get(req, res);
  } catch (err) {
    console.warn(err);
  }
});

module.exports = router;
