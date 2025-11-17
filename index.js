const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const config = require("./config/config");
mongoose
  .connect(config.mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("DB connection error:", err));

const app = express();

app.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true,
  })
);

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  next();
});


const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use(express.static("public"));

// for user routes
const userRoute = require("./routes/userRoute");
app.use("/", userRoute);

// for admin routes
const adminRoute = require("./routes/adminRoute");
app.use("/admin", adminRoute);

// 404 handler
app.use((req, res) => {
  res.status(404).render("404");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack); // logs the full error stack
  res
    .status(500)
    .render("error", { message: err.message || "Something went wrong" });
});

app.listen(config.port, () => console.log("Server running..."));
