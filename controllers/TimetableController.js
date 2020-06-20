const fetch = require("node-fetch");
const qs = require("qs");

const PzkoszApiController = require("./PzkoszApiController");

class TimetableController {
  constructor(leagueId, teamId) {
    this.leagueId = leagueId;
    this.teamId = teamId;
  }

  fetchTimetable = async seasonId => {
    try {
      const response = await fetch(process.env.API_ADDRESS, {
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: qs.stringify({
          key: process.env.API_KEY,
          function: "getTimetable",
          seasonid: seasonId,
          leagueid: this.leagueId,
          team: this.teamId
        })
      });

      const data = await response.json();

      return data;
    } catch (err) {
      console.warn(err);
    }
  };

  async get(req, res) {
    try {
      const seasonId = await PzkoszApiController.getSeasonId();
      const timetable = await this.fetchTimetable(seasonId);

      res.status(200).send(timetable);
    } catch (err) {
      console.warn(err);
    }
  }
}

module.exports = TimetableController;
