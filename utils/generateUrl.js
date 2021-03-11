const leagueTypes = require("../constants/leagueTypes");

const generateUrl = (leagueId, gameId) => {
  if (leagueTypes.REGIONAL.includes(leagueId)) {
    return `http://dzkosz.finteractive.pl/mecz/${gameId}/`;
  }

  if (leagueTypes.CENTRAL.includes(leagueId)) {
    return `https://rozgrywki.pzkosz.pl/mecz/${gameId}/`;
  }

  return null;
};

module.exports = generateUrl;
