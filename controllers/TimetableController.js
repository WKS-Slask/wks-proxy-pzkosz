const BaseController = require("./BaseController");
const fetchData = require("../utils/fetchData");
const formatDate = require("../utils/formatDate");
const { GET_TIMETABLE } = require("../constants/pzkoszMethods");
const leagueTypes = require("../constants/leagueTypes");
const getTimefromDate = require("../utils/getTimeFromDate");

class TimetableController extends BaseController {
  constructor({
    leagueid,
    seasonid,
    teamid,
    roundid,
    lineid,
    groupid,
    dateFrom,
    dateTo,
    hometeamid,
    awayteamid,
  }) {
    super();

    this.leagueId = leagueid;
    this.seasonId = seasonid;
    this.teamId = teamid;
    this.roundId = roundid;
    this.lineId = lineid;
    this.groupId = groupid;
    this.dateFrom = dateFrom;
    this.dateTo = dateTo;
    this.homeTeamId = hometeamid;
    this.awayTeamId = awayteamid;
  }

  generateUrl = (leagueId, gameId) => {
    if (leagueTypes.REGIONAL.includes(leagueId)) {
      return `http://dzkosz.finteractive.pl/mecz/${gameId}/`;
    }

    if (leagueTypes.CENTRAL.includes(leagueId)) {
      return `https://rozgrywki.pzkosz.pl/mecz/${gameId}/`;
    }

    return null;
  };

  formatTimetable = (timetable) => {
    if (!timetable) {
      return [];
    }

    return Object.values(timetable.items).map((game) => ({
      id: game.id,
      league: {
        id: game.liga.id,
        name: game.liga.nazwa,
      },
      line: {
        id: game.kolejka.id,
        name: game.kolejka.nazwa,
      },
      data: formatDate(game.data),
      time: getTimefromDate(game.data),
      homeTeam: {
        id: game.k1.id,
        name: game.k1.nazwa,
        logo: game.k1.logo.replace("50-50", "100-100"),
      },
      awayTeam: {
        id: game.k2.id,
        name: game.k2.nazwa,
        logo: game.k2.logo.replace("50-50", "100-100"),
      },
      score: {
        homeScore: game.wynik1,
        awayScore: game.wynik2,
        quarters: [
          game.kwarta1,
          game.kwarta2,
          game.kwarta3,
          game.kwarta4,
          game.dogrywka1,
          game.dogrywka2,
          game.dogrywka3,
          game.dogrywka4,
          game.dogrywka5,
        ].filter((quarter) => quarter !== "" && quarter !== "0:0"),
      },
      url: this.generateUrl(game.kolejka.ligaid, game.id),
    }));
  };

  getTimetable = async () =>
    await fetchData(
      {
        leagueid: this.leagueId,
        seasonid: this.seasonId || (await this.getCurrentSeasonId()),
        team: this.teamId,
        round: this.roundId,
        line: this.lineId,
        groupid: this.groupId,
        dateFrom: this.dateFrom,
        dateTo: this.dateTo,
        home: this.homeTeamId,
        visitor: this.awayTeamId,
      },
      GET_TIMETABLE,
      this.formatTimetable
    );

  get = async (req, res) => {
    try {
      const timetable = await this.getTimetable();
      res.status(200).send(timetable);
    } catch (err) {
      console.warn(err);
    }
  };
}

module.exports = TimetableController;
