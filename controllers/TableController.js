const fetchData = require("../utils/fetchData");
const { GET_LEAGUE_TABLE } = require("../constants/pzkoszMethods");
const BaseController = require("./BaseController");

class TableController extends BaseController {
  constructor({ leagueid, groupid, seasonid }) {
    super();

    this.leagueId = leagueid;
    this.groupId = groupid;
    this.seasonId = seasonid;
  }

  getTable = async () => {
    const seasonId = await this.getCurrentSeasonId();
    const args = {
      leagueid: this.leagueId,
      seasonid: this.seasonId || seasonId,
      groupid: this.groupId || 0,
    };
    const table = await fetchData(args, GET_LEAGUE_TABLE);
    return table;
  };

  async get(req, res) {
    const table = await this.getTable();

    res.status(200).send(table);
  }
}

module.exports = TableController;
