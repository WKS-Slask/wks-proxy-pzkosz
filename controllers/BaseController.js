const fetchData = require("../utils/fetchData");
const isEmptyObject = require("../utils/isEmptyObject");

const {
  GET_CURRENT_SEASON,
  GET_ALL_SEASONS,
  GET_ALL_LEAGUES,
  GET_LEAGUE,
} = require("../constants/pzkoszMethods");

class BaseController {
  getSeasonId = (seasonObj) => !isEmptyObject(seasonObj) && seasonObj.id;

  getCurrentSeason = async () => await fetchData({}, GET_CURRENT_SEASON);

  getCurrentSeasonId = async () =>
    await fetchData({}, GET_CURRENT_SEASON, this.getSeasonId);

  getAllSeasons = async () => await fetchData({}, GET_ALL_SEASONS);

  getAllLeagues = async () => await fetchData({}, GET_ALL_LEAGUES);

  parseLeagueName = (league) => league && league.nazwa;

  getLeagueName = async (id) => {
    const leagueName = fetchData(
      { leagueid: id },
      GET_LEAGUE,
      this.parseLeagueName
    );

    return leagueName;
  };
}

module.exports = BaseController;
