const fetch = require("node-fetch");
const qs = require("qs");

const formatDate = require("../utils/formatDate");

const PzkoszApiController = require("./PzkoszApiController");

class TimetableController {
  constructor(leagueId, teamId) {
    this.leagueId = leagueId;
    this.teamId = teamId;
  }

  formatTimetableData(data) {
    if (!data) {
      return [];
    }

    return Object.values(data.items).map(game => ({
      kolejka: game.kolejka,
      data: formatDate(game.data),
      k1: { ...game.k1, logo: game.k1.logo.replace("50-50", "100-100") },
      k2: { ...game.k2, logo: game.k2.logo.replace("50-50", "100-100") },
      id: game.id,
      wynik1: game.wynik1,
      wynik2: game.wynik2
    }));
  }

  fetchTimetable = async seasonId => {
    try {
      const response = await fetch(process.env.PZKOSZ_API_ADDRESS, {
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: qs.stringify({
          key: process.env.PZKOSZ_API_KEY,
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

      res.status(200).send(this.formatTimetableData(timetable));
    } catch (err) {
      console.warn(err);
    }
  }
}

module.exports = TimetableController;
