const express = require("express");
const session = require("express-session");

const Database = require("./ContactDB");
const db = new Database();
db.initialize();

const app = express();
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.db = db;
  next();
});

app.use(
  session({
    secret: "cmps369",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use((req, res, next) => {
  if (req.session.user) {
    res.locals.user = {
      id: req.session.user.ID,
      name: req.session.user.First_Name + " " + req.session.user.Last_Name,
    };
  }
  next();
});

app.get("/favicon.ico", (req, res) => res.status(204).end());
app.use(express.static("public"));

app.set("view engine", "pug");

app.use("/", require("./routes/accounts"));
app.use("/create", require("./routes/createnew"));
app.use("/places", require("./routes/places"));
app.use("/", require("./routes/mainlist"));

app.listen(8080, () => {
  console.log("Server is running on port 8080!");
});
