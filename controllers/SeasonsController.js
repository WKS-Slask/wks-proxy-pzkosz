const fetch = require("node-fetch");
const qs = require("qs");

class TableController {
  fetchSeasons = async () => {
    const response = await fetch(process.env.PZKOSZ_API_ADDRESS, {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: qs.stringify({
        key: process.env.PZKOSZ_API_KEY,
        function: "getAllSeasons",
      }),
    });

    const data = await response.json();

    return data;
  };

  getSeasons = async () => {
    const seasons = await this.fetchSeasons();

    return Object.values(seasons).map(({ id, nazwa }) => ({
      id,
      name: nazwa,
    }));
  };

  async get(req, res) {
    const seasons = await this.getSeasons();
    res.status(200).send(seasons);
  }
}

module.exports = TableController;
