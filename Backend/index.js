const express = require("express");
const app = express();
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const notFound = require("./middleware/notFound");
const errorHandlerMiddleware = require("./middleware/errorHandler");
const connectDB = require("./database/Connect");

app.use(express.json());

dotenv.config();

//routes
app.use("/api/v1/users", userRoute);
app.use("/api/v1/auth", authRoute);

app.use(notFound);
app.use(errorHandlerMiddleware);

// connect to database
const port = process.env.PORT || 2000;
const MONGO_URI = process.env.MONGO_URI
const start = async () => {
  try {
    await connectDB(MONGO_URI);
    app.listen(port, () => {
        console.log(`Server is listen on port ${port}...`)
    });
  } catch (error) {
    console.log(error);
  }
};

start();