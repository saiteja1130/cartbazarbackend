import express from "express";
import fs from "fs";
import cors from "cors";
import mongoDB from "./Configs/db.js";
import "dotenv/config";
import userRoute from "./Routes/userRoute.js";
import ProductRoute from "./Routes/ProductRoute.js";
const app = express();
const PORT = process.env.PORT || 5500;
await mongoDB();

app.use(express.static("public"));

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("hello");
});
app.use("/user", userRoute);
app.use("/user", ProductRoute);

app.listen(PORT, () => {
  console.log(`the server is live at http://localhost:${PORT}`);
});
