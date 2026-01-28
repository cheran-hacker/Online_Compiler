const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

console.log("Express Code Ready (Note: Long running processes may timeout)");