const express = require("express");

const TableController = require("../controllers/TableController");
const TimetableController = require("../controllers/TimetableController");

const router = express.Router();

router.get("/timetable/:teamId/:leagueId", async (req, res) => {
  try {
    const timetable = new TimetableController(
      req.params.leagueId,
      req.params.teamId
    );
    await timetable.get(req, res);
  } catch (err) {
    console.warn(err);
  }
});

router.get("/table/:leagueId/:groupId", async (req, res) => {
  const table = new TableController(req.params.leagueId, req.params.groupId);
  await table.get(req, res);
});

module.exports = router;
