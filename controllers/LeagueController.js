const { GET_LEAGUE } = require("../constants/pzkoszMethods");
const fetchData = require("../utils/fetchData");

class LeagueController {
  constructor({ leagueid }) {
    this.leagueId = leagueid;
  }

  getLeague = async () =>
    await fetchData({ leagueid: this.leagueId }, GET_LEAGUE);

  get = async (req, res) => {
    try {
      const league = await this.getLeague();
      res.status(200).send(league);
    } catch (err) {
      console.warn(err);
    }
  };
}

module.exports = LeagueController;
