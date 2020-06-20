const fetch = require("node-fetch");
const qs = require("qs");

const PzkoszApiController = require("./PzkoszApiController");

class PlayerController {
  constructor(id) {
    this.id = id;
  }

  formatPlayerData(data) {
    const getAge = birthDate => {
      const date = new Date();
      const birthYear = birthDate.substr(
        birthDate.length - 4,
        birthDate.length
      );

      return date.getFullYear() - parseInt(birthYear);
    };

    return {
      position: data.pozycja,
      height: data.wzrost,
      age: getAge(data.data_urodzenia)
    };
  }

  fetchPlayerData = async id => {
    try {
      const response = await fetch(process.env.API_ADDRESS, {
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: qs.stringify({
          key: process.env.API_KEY,
          function: "getPlayer",
          playerid: id
        })
      });

      const data = await response.json();

      return this.formatPlayerData(data[0]);
    } catch (err) {
      console.warn(err);
    }
  };

  formatRecords = async records => ({
    points: {
      value: records.Pkt.max,
      opponent: records.Pkt.z_kim[0].nazwa,
      league: await PzkoszApiController.getLeagueName(
        records.Pkt.z_kim[0].leagueid
      ),
      date: records.Pkt.z_kim[0].data.substr(
        0,
        records.Pkt.z_kim[0].data.indexOf(" ")
      ),
      label: "Punkty"
    },
    assists: {
      value: records.As.max,
      opponent: records.As.z_kim[0].nazwa,
      league: await PzkoszApiController.getLeagueName(
        records.As.z_kim[0].leagueid
      ),
      date: records.As.z_kim[0].data.substr(
        0,
        records.As.z_kim[0].data.indexOf(" ")
      ),
      label: "Asysty"
    },
    rebounds: {
      value: records.Sum.max,
      opponent: records.Sum.z_kim[0].nazwa,
      league: await PzkoszApiController.getLeagueName(
        records.Sum.z_kim[0].leagueid
      ),
      date: records.Sum.z_kim[0].data.substr(
        0,
        records.Sum.z_kim[0].data.indexOf(" ")
      ),
      label: "Zbiórki"
    }
  });

  formatStatistics = async statistics => {
    const promises = statistics.map(async data => {
      return {
        points: data.Pkt,
        assists: data.As,
        rebounds: data.Sum,
        league: await PzkoszApiController.getLeagueName(data.leagueid)
      };
    });
    return Promise.all(promises);
  };

  fetchPlayerSeasonRecords = async (playerId, seasonId) => {
    try {
      const response = await fetch(process.env.API_ADDRESS, {
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: qs.stringify({
          key: process.env.API_KEY,
          function: "getPlayerRecords",
          seasonid: seasonId,
          playerid: playerId
        })
      });

      const data = await response.json();

      return this.formatRecords(data);
    } catch (err) {
      console.warn(err);
    }
  };

  fetchPlayerCareerRecords = async id => {
    try {
      const response = await fetch(process.env.API_ADDRESS, {
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: qs.stringify({
          key: process.env.API_KEY,
          function: "getPlayerRecords",
          playerid: id
        })
      });

      const data = await response.json();

      return this.formatRecords(data);
    } catch (err) {
      console.warn(err);
    }
  };

  fetchPlayerStatistics = async (playerId, seasonId) => {
    try {
      const response = await fetch(process.env.API_ADDRESS, {
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: qs.stringify({
          key: process.env.API_KEY,
          function: "getPlayerStatistics",
          playerid: playerId,
          seasonid: seasonId
        })
      });

      const data = await response.json();

      const statistics = await this.formatStatistics(data);

      return statistics;
    } catch (err) {
      console.warn(err);
    }
  };

  getPlayer = (playerId, seasonId) =>
    Promise.all([
      this.fetchPlayerData(playerId),
      this.fetchPlayerSeasonRecords(playerId, seasonId),
      this.fetchPlayerCareerRecords(playerId),
      this.fetchPlayerStatistics(playerId, seasonId)
    ]).then(playerData => ({
      data: playerData[0],
      seasonRecords: playerData[1],
      careerRecords: playerData[2],
      statistics: playerData[3]
    }));

  async get(req, res) {
    const seasonId = await PzkoszApiController.getSeasonId();
    const data = await this.getPlayer(this.id, seasonId);
    res.status(200).send(data);
  }
}

module.exports = PlayerController;
