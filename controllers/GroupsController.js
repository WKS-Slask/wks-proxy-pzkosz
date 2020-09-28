const { GET_GROUPS, GET_TEAMS } = require("../constants/pzkoszMethods");
const fetchData = require("../utils/fetchData");
const BaseController = require("./BaseController");

class GroupsController extends BaseController {
  constructor({ seasonid, leagueid, roundid }) {
    super();

    this.seasonId = seasonid;
    this.leagueId = leagueid;
    this.roundId = roundid;
  }

  getGroupTeams = async (groupId) =>
    await fetchData(
      {
        seasonid: this.seasonId || (await this.getCurrentSeasonId()),
        leagueid: this.leagueId,
        groupid: groupId,
      },
      GET_TEAMS
    );

  formatGroups = (groups) => groups.grupy;

  getGroups = async () => {
    const groups = await fetchData(
      {
        seasonid: this.seasonId || (await this.getCurrentSeasonId()),
        leagueid: this.leagueId,
        roundid: this.roundId,
      },
      GET_GROUPS,
      this.formatGroups
    );

    return Promise.all(
      groups.map(async ({ id, nazwa }) => {
        const teams = await this.getGroupTeams(id);
        return {
          id: id,
          name: nazwa,
          teams: Object.values(teams).map(({ nazwa, logo }) => ({
            name: nazwa,
            logo: logo,
          })),
        };
      })
    );
  };

  get = async (req, res) => {
    try {
      const groups = await this.getGroups();
      res.status(200).send(groups);
    } catch (err) {
      console.warn(err);
    }
  };
}

module.exports = GroupsController;
