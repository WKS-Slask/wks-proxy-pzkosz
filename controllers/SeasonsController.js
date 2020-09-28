const BaseController = require("./BaseController");

class SeasonsController extends BaseController {
  formatSeasons = async (seasons) =>
    Object.values(seasons).map(({ id, nazwa }) => ({
      id,
      name: nazwa,
    }));

  getSeasons = async () => {
    const seasons = await this.getAllSeasons();
    return this.formatSeasons(seasons);
  };

  async get(req, res) {
    const seasons = await this.getSeasons();
    res.status(200).send(seasons);
  }
}

module.exports = SeasonsController;
