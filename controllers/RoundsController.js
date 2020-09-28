const BaseController = require("./BaseController");
const fetchData = require("../utils/fetchData");
const { GET_ROUNDS } = require("../constants/pzkoszMethods");

class RoundsController extends BaseController {
  constructor({ leagueid, seasonid }) {
    super();

    this.seasonId = seasonid;
    this.leagueId = leagueid;
  }

  formatRounds = (rounds) =>
    rounds.map(({ nazwa, id }) => ({
      id,
      name: nazwa,
    }));

  getRounds = async () =>
    await fetchData(
      {
        seasonid: this.seasonId || (await this.getCurrentSeasonId()),
        leagueid: this.leagueId,
      },
      GET_ROUNDS,
      this.formatRounds
    );

  get = async (req, res) => {
    try {
      const rounds = await this.getRounds();
      res.status(200).send(rounds);
    } catch (err) {
      console.warn(err);
    }
  };
}

module.exports = RoundsController;
