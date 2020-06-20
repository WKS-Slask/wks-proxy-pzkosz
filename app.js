const express = require("express");
const helmet = require("helmet");
var cors = require("cors");

const upcomingGames = require("./routes/games");
const player = require("./routes/player");
const team = require("./routes/team");

const app = express();

const port = process.env.PORT || 5000;

require("dotenv").config();

app.use(helmet());
app.use(cors());

app.use("/api/upcoming-games", upcomingGames);
app.use("/api/player", player);
app.use("/api/team", team);

app.listen(port, () => console.log(`App is working on port ${port}`));
