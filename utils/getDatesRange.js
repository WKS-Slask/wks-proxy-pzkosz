const prefixWithZero = value => {
  if (value < 10) {
    return `0${value}`;
  }

  return value;
};

const getDatesRange = () => {
  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  const day = {
    now: today.getDate(),
    weekFromNow: nextWeek.getDate()
  };

  const month = {
    now: today.getMonth() + 1,
    weekFromNow: nextWeek.getMonth() + 1
  };

  const year = {
    now: today.getFullYear(),
    weekFromNow: nextWeek.getFullYear()
  };

  const now = `${year.now}-${prefixWithZero(month.now)}-${prefixWithZero(
    day.now
  )}`;
  const weekFromNow = `${year.weekFromNow}-${prefixWithZero(
    month.weekFromNow
  )}-${prefixWithZero(day.weekFromNow)}`;

  return [now, weekFromNow];
};

module.exports = getDatesRange;
