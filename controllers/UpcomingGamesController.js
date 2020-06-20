const fetch = require("node-fetch");
const qs = require("qs");

const getDatesRange = require("../utils/getDatesRange");
const pzkoszIDs = require("../constants/pzkoszIDs");
const PzkoszApiController = require("./PzkoszApiController");

class UpcomingGamesController {
  formatGameData(data, league) {
    return {
      // date: parseInt(data.mdata),
      id: data.id,
      date: 1597938759,
      league,
      homeTeam: {
        name: data.k1.nazwa,
        logo: data.k1.logo.replace("50-50", "200-200")
      },
      awayTeam: {
        name: data.k2.nazwa,
        logo: data.k2.logo.replace("50-50", "200-200")
      },
      address: data.hala.full
    };
  }

  fetchTeamUpcomingGames(leagueId, leagueName, teamId, seasonId) {
    return new Promise((resolve, reject) => {
      fetch(process.env.API_ADDRESS, {
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: qs.stringify({
          key: process.env.API_KEY,
          function: "getTimetable",
          seasonid: seasonId,
          leagueid: leagueId,
          team: teamId,
          // dateFrom: now,
          // dateTo: weekFromNow
          dateFrom: "2019-12-10",
          dateTo: "2019-12-20"
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

  async get(req, res) {
    const seasonId = await PzkoszApiController.getSeasonId();
    const upcomingGames = await this.getUpcomingGames(seasonId);

    res.status(200).send(upcomingGames);
  }
}

module.exports = UpcomingGamesController;
