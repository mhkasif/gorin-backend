const express = require("express");
const cors = require("cors");
var bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

let data = {
};
app.get("/:id", (req, res) => {
  const { id } = req.params;
  console.log(id, "get");
  res.status(200).json({
    data: data[id] || [],
  });
});
app.delete("/:userID/:id", (req, res) => {
  const { userID, id } = req.params;
  data[userID] = data[userID].filter((x) => x.id !== id);
  res.status(200).json({
    message: "deleted",
  });
});
app.post("/add", (req, res) => {
  const { data: d, userID } = req.body;
  data[userID] = [...(data[userID]||[]), d];

  res.status(200).json({
    message: "added",
  });
});
app.put("/update", (req, res) => {
  const { data: d, userID } = req.body;
  data[userID] = data[userID].map((x) => {
    if (x.id !== d.id) return x;
    return { ...x, ...d };
  });

  res.status(200).json({
    message: "updated",
  });
});
app.put("/update-all", (req, res) => {
  const { data: d, userID } = req.body;

  data[userID] = d;

  res.status(200).json({
    message: "updated-all",
  });
});
app.listen(8000, () => {
  console.log("app is running");
});
