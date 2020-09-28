const { GET_TEAMS } = require("../constants/pzkoszMethods");
const fetchData = require("../utils/fetchData");

class TeamsController {
  constructor({ leagueid, groupid, seasonid }) {
    this.leagueId = leagueid;
    this.groupId = groupid;
    this.seasonId = seasonid;
  }

  formatTeams = (teams) =>
    Object.values(teams).map(({ id, nazwa, logo }) => ({
      id,
      name: nazwa,
      logo,
    }));

  getTeams = async () =>
    await fetchData(
      {
        seasonid: this.seasonId || (await this.getCurrentSeasonId()),
        leagueid: this.leagueId,
        groupid: this.groupId,
      },
      GET_TEAMS,
      this.formatTeams
    );

  get = async (req, res) => {
    try {
      const teams = await this.getTeams();
      res.status(200).send(teams);
    } catch (err) {
      console.warn(err);
    }
  };
}

module.exports = TeamsController;
