const fetch = require("node-fetch");
const qs = require("qs");

const PzkoszApiController = require("./PzkoszApiController");

class GroupsController {
  constructor(leagueId, seasonId) {
    this.leagueId = leagueId;
    this.seasonId = seasonId;
  }

  fetchGroupTeams = async (seasonId, groupId) => {
    try {
      const response = await fetch(process.env.PZKOSZ_API_ADDRESS, {
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: qs.stringify({
          key: process.env.PZKOSZ_API_KEY,
          function: "getTeams",
          seasonid: seasonId,
          groupid: groupId,
          leagueid: this.leagueId
        })
      });

      const data = await response.json();

      return data;
    } catch (err) {
      console.warn(err);
    }
  };

  fetchRounds = async seasonId => {
    try {
      const response = await fetch(process.env.PZKOSZ_API_ADDRESS, {
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: qs.stringify({
          key: process.env.PZKOSZ_API_KEY,
          function: "getRounds",
          seasonid: seasonId,
          leagueid: this.leagueId
        })
      });

      const data = await response.json();

      return data;
    } catch (err) {
      console.warn(err);
    }
  };

  fetchGroups = async (seasonId, roundId) => {
    try {
      const response = await fetch(process.env.PZKOSZ_API_ADDRESS, {
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: qs.stringify({
          key: process.env.PZKOSZ_API_KEY,
          function: "getGroups",
          seasonid: seasonId,
          leagueid: this.leagueId,
          roundid: roundId
        })
      });

      const data = await response.json();

      return data;
    } catch (err) {
      console.warn(err);
    }
  };

  getGroups = async (seasonId, groupsIds) => {
    try {
      const rounds = await this.fetchRounds(seasonId);

      if (!rounds || !Array.isArray(rounds)) {
        return [];
      }

      const groups = rounds[0].groups.map(group => ({
        id: group.id,
        name: `Grupa ${group.nazwa}`
      }));

      return Promise.all(
        groups.map(async group => {
          const teams = await this.fetchGroupTeams(seasonId, group.id);

          return {
            ...group,
            teams: Object.values(teams).map(({ nazwa, logo }) => ({
              name: nazwa,
              logo: logo
            }))
          };
        })
      );
    } catch (er) {
      console.warn(er);
    }
  };

  async get(req, res) {
    try {
      const seasonId =
        this.seasonId || (await PzkoszApiController.getSeasonId());
      const groups = await this.getGroups(seasonId, []);
      res.status(200).send(groups);
    } catch (err) {
      console.warn(err);
    }
  }
}

module.exports = GroupsController;
