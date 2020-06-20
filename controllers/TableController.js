const fetch = require("node-fetch");
const qs = require("qs");

const PzkoszApiController = require("./PzkoszApiController");

class TableController {
  constructor(leagueId, groupId) {
    this.leagueId = leagueId;
    this.groupId = groupId;
  }

  fetchTable = async seasonId => {
    const response = await fetch(process.env.API_ADDRESS, {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: qs.stringify({
        key: process.env.API_KEY,
        function: "getLeagueTable",
        seasonid: seasonId,
        leagueid: this.leagueId,
        groupid: this.groupId
      })
    });

    const data = await response.json();

    return data;
  };

  async get(req, res) {
    const seasonId = await PzkoszApiController.getSeasonId();
    const table = await this.fetchTable(seasonId);

    res.status(200).send(table);
  }
}

module.exports = TableController;
