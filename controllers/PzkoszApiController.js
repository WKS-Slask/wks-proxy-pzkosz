const fetch = require("node-fetch");
const qs = require("qs");

class PzkoszApiController {
  static getSeasonId = async () => {
    const response = await fetch(process.env.API_ADDRESS, {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: qs.stringify({
        key: process.env.API_KEY,
        function: "getCurrentSeason"
      })
    });

    const season = await response.json();

    return season.id;
  };

  static getAllLeagues = async () => {
    const response = await fetch(process.env.API_ADDRESS, {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: qs.stringify({
        key: process.env.API_KEY,
        function: "getAllLeagues"
      })
    });

    const allLeagues = await response.json();

    return allLeagues;
  };

  static getLeagueName = async id => {
    const response = await fetch(process.env.API_ADDRESS, {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: qs.stringify({
        key: process.env.API_KEY,
        function: "getLeague",
        leagueid: id
      })
    });

    const league = await response.json();

    return league.nazwa;
  };
}

module.exports = PzkoszApiController;
