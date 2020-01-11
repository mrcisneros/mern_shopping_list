/** @format */

const express = require("express");
const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
const config = require("config");
const items = require("./routes/api/items");

const app = express();

//Bodyparser middleware
app.use(express.json());

//DB configurtion
// const db = require("./config/keys").mongoURI;
const db = config.get("mongoURI");

//Connect to MongoDB
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => console.log("MongoDB connected."))
  .catch(err => console.log(err));

//Use Routes
app.use("/api/items", items);
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
