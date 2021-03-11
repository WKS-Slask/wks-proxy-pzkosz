const BaseController = require("./BaseController");

class LeaguesController extends BaseController {
  constructor() {
    super();
  }

  formatLeagues = (leagues) =>
    Object.values(leagues).map(({ id, nazwa, skrot }) => ({
      id,
      name: `${nazwa} (${skrot})`,
    }));

  getLeagues = async () => {
    const leagues = await this.getAllLeagues();
    return this.formatLeagues(leagues);
  };

  async get(req, res) {
    try {
      const leagues = await this.getLeagues();
      res.status(200).send(leagues);
    } catch (err) {
      console.warn(err);
    }
  }
}

module.exports = LeaguesController;
