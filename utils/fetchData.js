const fetch = require("node-fetch");
const qs = require("qs");

const fetchData = async (args, fn, callback) => {
  try {
    const response = await fetch(process.env.PZKOSZ_API_ADDRESS, {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: qs.stringify({
        key: process.env.PZKOSZ_API_KEY,
        function: fn,
        ...args,
      }),
    });

    const data = await response.json();

    return typeof callback === "function" ? callback(data) : data;
  } catch (err) {
    console.warn(err);
  }
};

module.exports = fetchData;
