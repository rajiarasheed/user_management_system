const mongoose= require("mongoose");
const express= require("express");
const config=require('./config/config');
mongoose.connect(config.mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("DB connection error:", err));

const app=express();


app.set('view engine','ejs');
app.set('views','./views');  // or './views/admin' depending on your structure
app.use(express.static('public'));
// for user routes
const userRoute=require("./routes/userRoute");
app.use("/",userRoute);

// for admin routes
const adminRoute=require("./routes/adminRoute");
app.use("/admin",adminRoute);

// 404 handler
app.use((req, res) => {
  res.status(404).render("404");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack); // logs the full error stack
  res.status(500).render("error", { message: err.message || "Something went wrong" });
});

app.listen(config.port,()=>console.log("Server running..."));