const fetch = require("node-fetch");
const qs = require("qs");

const getDatesRange = require("../utils/getDatesRange");
const isEmptyObject = require("../utils/isEmptyObject");
const pzkoszIDs = require("../constants/pzkoszIDs");
const PzkoszApiController = require("./PzkoszApiController");

class UpcomingGamesController {
  formatGameData(data, league) {
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
        logo: data.k1.logo.replace("50-50", "200-200")
      },
      awayTeam: {
        id: data.k2.id,
        name: data.k2.nazwa,
        logo: data.k2.logo.replace("50-50", "200-200")
      },
      address: data.hala.full
    };
  }

  fetchTeamUpcomingGames(leagueId, leagueName, teamId, seasonId) {
    const [now, weekFromNow] = getDatesRange();
    return new Promise((resolve, reject) => {
      fetch(process.env.PZKOSZ_API_ADDRESS, {
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: qs.stringify({
          key: process.env.PZKOSZ_API_KEY,
          function: "getTimetable",
          seasonid: seasonId,
          leagueid: leagueId,
          team: teamId,
          dateFrom: now,
          dateTo: weekFromNow
        })
      })
        .then(data => data.json())
        .then(data => {
          const formatedGameData = this.formatGameData(
            Object.values(data.items)[0],
            leagueName
          );
          resolve(formatedGameData);
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });
  }

  getUpcomingGames = seasonId =>
    Promise.all(
      pzkoszIDs.map(team =>
        this.fetchTeamUpcomingGames(
          team.leagueId,
          team.leagueName,
          team.id,
          seasonId
        )
      )
    );

  validateData = data => data.filter(object => !isEmptyObject(object));

  async get(req, res) {
    const seasonId = await PzkoszApiController.getSeasonId();
    const upcomingGames = await this.getUpcomingGames(seasonId);

    res.status(200).send(this.validateData(upcomingGames));
  }
}

module.exports = UpcomingGamesController;
