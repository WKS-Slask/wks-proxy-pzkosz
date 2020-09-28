const express = require("express");

const TeamsController = require("../controllers/TeamsController");
const LeagueController = require("../controllers/LeagueController");
const RoundsController = require("../controllers/RoundsController");
const LinesController = require("../controllers/LinesController");
const GroupsController = require("../controllers/GroupsController");
const TableController = require("../controllers/TableController");

const router = express.Router();

router.get("/", async (req, res) => {
  const league = new LeagueController(req.query);
  await league.get(req, res);
});

router.get("/rounds", async (req, res) => {
  const rounds = new RoundsController(req.query);
  await rounds.get(req, res);
});

router.get("/lines", async (req, res) => {
  const lines = new LinesController(req.query);
  await lines.get(req, res);
});

router.get("/groups", async (req, res) => {
  const groups = new GroupsController(req.query);
  await groups.get(req, res);
});

router.get("/teams", async (req, res) => {
  const teams = new TeamsController(req.query);
  await teams.get(req, res);
});

router.get("/table", async (req, res) => {
  const table = new TableController(req.query);
  await table.get(req, res);
});

module.exports = router;
