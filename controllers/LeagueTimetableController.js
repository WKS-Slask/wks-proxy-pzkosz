const fetch = require("node-fetch");
const qs = require("qs");
const groupBy = require("lodash/groupBy");
const sortBy = require("lodash/sortBy");

const formatDate = require("../utils/formatDate");

const PzkoszApiController = require("./PzkoszApiController");

class LeagueTimetableController {
  constructor(leagueId, seasonId, groupId) {
    this.leagueId = leagueId;
    this.seasonId = seasonId;
    this.groupId = groupId;
  }

  getScore(homeScore, awayScore) {
    if (!homeScore && !awayScore) {
      return null;
    }

    return `${homeScore}:${awayScore}`;
  }

  getTimefromDate(date) {
    if (date.indexOf(" ") === -1) {
      return "00:00";
    }

    return date.slice(date.indexOf(" ") + 1);
  }

  formatTimetableData(data) {
    if (!data) {
      return [];
    }

    const sortedGames = sortBy(
      Object.values(data.items).map((game) => ({
        date: formatDate(game.data),
        time: this.getTimefromDate(game.data),
        homeTeam: {
          name: game.k1.nazwa,
          logo: game.k1.logo ? game.k1.logo.replace("50-50", "100-100") : null,
        },
        awayTeam: {
          name: game.k2.nazwa,
          logo: game.k2.logo ? game.k2.logo.replace("50-50", "100-100") : null,
        },
        id: game.id,
        score: this.getScore(game.wynik1, game.wynik2),
      })),
      ["date", "time"]
    );

    return groupBy(sortedGames, "date");
  }

  fetchTimetable = async (seasonId) => {
    try {
      const response = await fetch(process.env.PZKOSZ_API_ADDRESS, {
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify({
          key: process.env.PZKOSZ_API_KEY,
          function: "getTimetable",
          seasonid: seasonId,
          leagueid: this.leagueId,
          groupid: this.groupId,
        }),
      });

      const data = await response.json();

      return data;
    } catch (err) {
      console.warn(err);
    }
  };

  async get(req, res) {
    try {
      const seasonId =
        this.seasonId || (await PzkoszApiController.getSeasonId());
      const timetable = await this.fetchTimetable(seasonId);
      res.status(200).send(this.formatTimetableData(timetable));
    } catch (err) {
      console.warn(err);
    }
  }
}

module.exports = LeagueTimetableController;
