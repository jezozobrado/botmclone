require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const books = require("./routes/books");
const users = require("./routes/users");
const auth = require("./routes/auth");
const carts = require("./routes/carts");
const cors = require("cors");

const app = express();

const corsOptions = {
  exposedHeaders: ["x-auth-token"],
};

app.use(cors(corsOptions));

mongoose
  .connect(
    "mongodb+srv://jezozobrado:hn3mTPRD@mongo-playground.nr0qfnc.mongodb.net/botm?retryWrites=true&w=majority"
  )
  .then(() => console.log("Connected to the database."))
  .catch((err) => console.log("oops", err));

app.use(express.json());
app.use("/api/books", books);
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/carts", carts);
require("./prod")(app);

app.listen(process.env.PORT, () => console.log("Listening on port 3000"));
