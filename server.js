const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const colors = require("colors");
const path = require("path");
const morgan = require("morgan");
const cors = require("cors");
const { json } = require("body-parser");
const { nanoid } = require("nanoid");

dotenv.config({ path: "./config.env" });

const app = express();

//request logger
app.use(morgan("tiny"));

//cross Origin
app.use(cors());
app.options("*", cors());
// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.json({ extended: false }));

// db connection
const db = require("./app/models");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// add express json middleware
app.use(express.static(path.join(__dirname, "/src/build")));
app.use(express.json());

// test Routes
app.get("/", (req, res) => res.json({ aplication_name: "Doctor Appointment" }));

// files routes
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname + "/src/build/index.html"));
// });

// app routes
require("./app/routes/users.route")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`.green.bold);
});

// app.listen(PORT, console.log(`Server running on port ${PORT}`.green.bold));
