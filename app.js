const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");

const upcomingGames = require("./routes/upcoming-games");
const player = require("./routes/player");
const league = require("./routes/league");
const leagues = require("./routes/leagues");
const seasons = require("./routes/seasons");
const timetable = require("./routes/timetable");

const app = express();
const port = process.env.PORT || 3001;

require("dotenv").config();

app.use(helmet());
app.use(cors());
app.use(compression());

app.use("/api/upcoming-games", upcomingGames);
app.use("/api/player", player);
app.use("/api/league", league);
app.use("/api/leagues", leagues);
app.use("/api/timetable", timetable);
app.use("/api/seasons", seasons);

app.listen(port, () => console.log(`App is working on port ${port}`));
