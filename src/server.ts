import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import config from "./config";
import routes from "./modules/routes";
const app = express();
app.use(cors({
  origin: 'http://localhost:5173', // your frontend origin
  credentials: true,
}));
app.use(express.json());
app.use(routes);

app.get("/", (req, res) => {
  res.send({ success: true, message: "Wecome to Library management server" });
});

app.listen(config.port, () => {
  console.log(`Server is Running on ${5000}`);
});

async function server() {
  try {
    await mongoose.connect(config.database_url!);
    console.log(`Connected to Databased`);
  } catch (error) {
    console.error(`Server error ${server}`);
  }
}

server();
