const express = require("express");

const TableController = require("../controllers/TableController");
const TeamTimetableController = require("../controllers/TeamTimetableController");

const router = express.Router();

router.get("/timetable/:teamId/:leagueId/:seasonId?", async (req, res) => {
  try {
    const timetable = new TeamTimetableController(
      req.params.leagueId,
      req.params.teamId,
      req.params.seasonId
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
