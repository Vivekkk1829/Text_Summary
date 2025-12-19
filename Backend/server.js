require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
app.use(cookieParser());

const authRouter = require("./routes/auth-route.js");
const summariseRouter = require("./routes/summarise-route.js");

//Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to MongoDB");
    app.use(
      cors({
        origin: ["http://localhost:5173",
          "https://text-summary-6plv.vercel.app"],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    );
    app.use(express.json());

    app.get("/", (req, res) => {
      res.send("Hello");
    });

    app.use("/api/auth", authRouter);
    app.use("/api/summarise", summariseRouter);

    const port = 3000;
    app.listen(port, () => {
      console.log(`App is tunning sucessfully on ${port}`);
    });
  })
  .catch((err) => console.log(err));
