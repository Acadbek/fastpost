import express from "express";

console.log("server file started");

const app = express();

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.listen(3000, () => {
  console.log("Backend running on http://localhost:3000");
});