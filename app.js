const path = require("path");
const express = require("express");
const morgan = require("morgan");
const cookieparser = require("cookie-parser");
const userRouter = require("./routes/userRoute");
const insuranceRouter = require("./routes/insuranceRoute");
const cropRouter = require("./routes/predictionRoute");
const assignmentRouter = require("./routes/assignmentRoute");
const trackRouter = require("./routes/trackingRoute");
const UserlocationRouter = require("./routes/userLocationRoute");
const paymentRouter = require("./routes/paymentRoute");
const claimRouter = require("./routes/claimRoute");
const chatRouter = require("./routes/chatRoute");
const AppError = require("./utils/appErrors");

const app = express();
const cors = require("cors");

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());

app.use(cookieparser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    origin: true,
    optionsSuccessStatus: 200,
    allowedHeaders: [
      "set-cookie",
      "Content-Type",
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Credentials",
    ],
  })
);

app.use("/api/v1/users", userRouter);
app.use("/api/v1/insurance", insuranceRouter);
app.use("/api/v1/crops", cropRouter);
app.use("/api/v1/assign", assignmentRouter);
app.use("/api/v1/track", trackRouter);
app.use("/api/v1/location", UserlocationRouter);
app.use("/api/v1/claim", claimRouter);
app.use("/api/v1/ai", chatRouter);

app.use("/api/v1/payment", paymentRouter);
app.all("*", (req, res, next) => {
  next(new AppError(`can't find the ${req.originalUrl} url`));
});

module.exports = app;
