const getTimefromDate = (date) => {
  if (date.indexOf(" ") === -1) {
    return "00:00";
  }

  return date.slice(date.indexOf(" ") + 1);
};

module.exports = getTimefromDate;
