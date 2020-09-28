const BaseController = require("./BaseController");
const pzkoszIDs = require("../constants/pzkoszIDs");
const { GET_TIMETABLE } = require("../constants/pzkoszMethods");
const fetchData = require("../utils/fetchData");
const getDatesRange = require("../utils/getDatesRange");
const isEmptyObject = require("../utils/isEmptyObject");

class UpcomingGamesController extends BaseController {
  constructor() {
    super();
  }

  parseGameData(data, league) {
    if (!data) {
      return {};
    }

    return {
      id: data.id,
      date: parseInt(data.mdata),
      league,
      homeTeam: {
        id: data.k1.id,
        name: data.k1.nazwa,
        logo: data.k1.logo.replace("50-50", "100-100"),
      },
      awayTeam: {
        id: data.k2.id,
        name: data.k2.nazwa,
        logo: data.k2.logo.replace("50-50", "100-100"),
      },
      address: data.hala.full,
    };
  }

  getTeamUpcomingGames = async (leagueId, leagueName, teamId, seasonId) => {
    const [now, weekFromNow] = getDatesRange();

    const upcomingGames = await fetchData(
      {
        seasonid: seasonId,
        leagueid: leagueId,
        team: teamId,
        dateFrom: now,
        dateTo: weekFromNow,
      },
      GET_TIMETABLE
    );
    return this.parseGameData(
      Object.values(upcomingGames.items)[0],
      leagueName
    );
  };

  getUpcomingGames = async () => {
    const seasonId = await this.getCurrentSeasonId();

    return Promise.all(
      pzkoszIDs.map((team) =>
        this.getTeamUpcomingGames(
          team.leagueId,
          team.leagueName,
          team.id,
          seasonId
        )
      )
    );
  };

  validateData = (data) => data.filter((object) => !isEmptyObject(object));

  async get(req, res) {
    const upcomingGames = await this.getUpcomingGames();
    const filteredUpcomingGames = upcomingGames.filter(
      (game) => game.date > Math.floor(Date.now() / 1000)
    );

    res.status(200).send(this.validateData(filteredUpcomingGames));
  }
}

module.exports = UpcomingGamesController;
