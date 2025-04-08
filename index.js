const customerRouter = require("./routes/customerRoute");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const app = express();
dotenv.config();
app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("mongoDB connected successfully"))
  .catch((error) => console.log(error));

app.use("/customer", customerRouter);
app.get("/", (req, res) => {
  res.send("namaste");
});
app.listen(PORT, () => {
  console.log(`server started and running at ${PORT}`);
});
