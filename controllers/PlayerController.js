const {
  GET_PLAYER,
  GET_PLAYER_RECORDS,
  GET_PLAYER_STATISTICS,
} = require("../constants/pzkoszMethods");
const fetchData = require("../utils/fetchData");
const BaseController = require("./BaseController");

class PlayerController extends BaseController {
  constructor(id) {
    super();

    this.id = id;
  }

  parsePlayerData(data) {
    const getAge = (birthDate) => {
      const date = new Date();
      const birthYear = birthDate.substr(
        birthDate.length - 4,
        birthDate.length
      );

      return date.getFullYear() - parseInt(birthYear);
    };

    return {
      position: data[0].pozycja,
      height: data[0].wzrost,
      age: getAge(data[0].data_urodzenia),
    };
  }

  parsePlayerRecords = async ({ Pkt, As, Sum }) => {
    if (!Pkt.max || !As.max || !Sum.max) {
      return {};
    }

    return {
      points: {
        value: Pkt.max,
        opponent: Pkt.z_kim[0].nazwa,
        league: await this.getLeagueName(Pkt.z_kim[0].leagueid),
        date: Pkt.z_kim[0].data.substr(0, Pkt.z_kim[0].data.indexOf(" ")),
        label: "Punkty",
      },
      assists: {
        value: As.max,
        opponent: As.z_kim[0].nazwa,
        league: await this.getLeagueName(As.z_kim[0].leagueid),
        date: As.z_kim[0].data.substr(0, As.z_kim[0].data.indexOf(" ")),
        label: "Asysty",
      },
      rebounds: {
        value: Sum.max,
        opponent: Sum.z_kim[0].nazwa,
        league: await this.getLeagueName(Sum.z_kim[0].leagueid),
        date: Sum.z_kim[0].data.substr(0, Sum.z_kim[0].data.indexOf(" ")),
        label: "Zbiórki",
      },
    };
  };

  parsePlayerStatistics = async (statistics) => {
    const promises = statistics.map(async (data) => {
      return {
        points: data.Pkt,
        assists: data.As,
        rebounds: data.Sum,
        league: await this.getLeagueName(data.leagueid),
      };
    });
    return Promise.all(promises);
  };

  getPlayerData = async () => {
    const playerData = await fetchData(
      { playerid: this.id },
      GET_PLAYER,
      this.parsePlayerData
    );

    return playerData;
  };

  getPlayerSeasonRecords = async () => {
    const currentSeasonId = await this.getCurrentSeasonId();
    const seasonRecords = await fetchData(
      {
        seasonid: currentSeasonId,
        playerid: this.id,
      },
      GET_PLAYER_RECORDS,
      this.parsePlayerRecords
    );

    return seasonRecords;
  };

  getPlayerCareerRecords = async () => {
    const careerRecords = await fetchData(
      {
        playerid: this.id,
      },
      GET_PLAYER_RECORDS,
      this.parsePlayerRecords
    );

    return careerRecords;
  };

  getPlayerStatistics = async () => {
    const currentSeasonId = await this.getCurrentSeasonId();
    const playerStatistics = await fetchData(
      {
        playerid: this.id,
        seasonid: currentSeasonId,
      },
      GET_PLAYER_STATISTICS,
      this.parsePlayerStatistics
    );

    return playerStatistics;
  };

  getPlayer = () =>
    Promise.all([
      this.getPlayerData(),
      this.getPlayerSeasonRecords(),
      this.getPlayerCareerRecords(),
      this.getPlayerStatistics(),
    ]).then((playerData) => ({
      data: playerData[0],
      seasonRecords: playerData[1],
      careerRecords: playerData[2],
      statistics: playerData[3],
    }));

  async get(req, res) {
    const data = await this.getPlayer();
    res.status(200).send(data);
  }
}

module.exports = PlayerController;
