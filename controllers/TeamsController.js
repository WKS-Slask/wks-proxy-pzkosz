class TeamsController {
  constructor(leagueId, groupId, seasonId) {
    this.leagueId = leagueId;
    this.groupId = groupId;
    this.seasonId = seasonId;
  }

  async get(req, res) {
    try {
      res.status(200).send("teams");
    } catch (err) {
      console.warn(err);
    }
  }
}

module.exports = TeamsController;
