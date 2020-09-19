const fetch = require("node-fetch");
const qs = require("qs");

class TableController {
  fetchLeagues = async () => {
    const response = await fetch(process.env.PZKOSZ_API_ADDRESS, {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: qs.stringify({
        key: process.env.PZKOSZ_API_KEY,
        function: "getAllLeagues",
      }),
    });

    const data = await response.json();

    return data;
  };

  getLeagues = async () => {
    const leagues = await this.fetchLeagues();

    return Object.values(leagues).map(({ id, nazwa, skrot }) => ({
      id,
      name: `${nazwa} (${skrot})`,
    }));
  };

  async get(req, res) {
    const leagues = await this.getLeagues();
    res.status(200).send(leagues);
  }
}

module.exports = TableController;
