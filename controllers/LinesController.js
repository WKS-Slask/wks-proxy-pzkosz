const { GET_LINES } = require("../constants/pzkoszMethods");
const fetchData = require("../utils/fetchData");
const BaseController = require("./BaseController");

class LinesController extends BaseController {
  constructor({ seasonid, leagueid, roundid }) {
    super();

    this.seasonId = seasonid;
    this.leagueId = leagueid;
    this.roundId = roundid;
  }

  getLines = async () =>
    await fetchData(
      {
        seasonid: this.seasonId || (await this.getCurrentSeasonId()),
        leagueid: this.leagueId,
        roundid: this.roundId,
      },
      GET_LINES
    );

  get = async (req, res) => {
    try {
      const lines = await this.getLines();
      res.status(200).send(lines);
    } catch (err) {
      console.warn(err);
    }
  };
}
module.exports = LinesController;
