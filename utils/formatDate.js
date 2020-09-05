const formatDate = date => {
  if (date.indexOf(" ") === -1) {
    return date;
  }

  return date.slice(0, date.indexOf(" "));
};

module.exports = formatDate;
