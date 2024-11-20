const express = require("express");
const cors = require("cors");
const router = require("./src/routes");
const bodyParser = require("body-parser");
const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());
app.use("/api/v1", router);
app.use(bodyParser.urlencoded({ extended: false }));
app.get("/", (req, res) => {
  res.send("welcome express");
});

app.listen(port, () => {
  console.log(`server run at ${port}`);
});
