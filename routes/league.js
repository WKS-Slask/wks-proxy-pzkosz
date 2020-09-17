const express = require("express");

const TeamsController = require("../controllers/TeamsController");
const GroupsController = require("../controllers/GroupsController");
const LeagueTimetableController = require("../controllers/LeagueTimetableController");

const router = express.Router();

router.get("/teams/:leagueId/:groupId/:seasonId?", async (req, res) => {
  const teams = new TeamsController(
    req.params.leagueId,
    req.params.groupId,
    req.params.seasonId
  );
  await teams.get(req, res);
});

router.get("/groups/:leagueId/:seasonId?", async (req, res) => {
  const groups = new GroupsController(req.params.leagueId, req.params.seasonId);
  await groups.get(req, res);
});

router.get("/timetable/:leagueId/:seasonId/:groupId?", async (req, res) => {
  const timetable = new LeagueTimetableController(
    req.params.leagueId,
    req.params.seasonId,
    req.params.groupId
  );
  await timetable.get(req, res);
});

module.exports = router;
