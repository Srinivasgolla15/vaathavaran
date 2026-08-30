import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/weatherDB";

// DB Connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log("connected to db"))
  .catch((err) => console.error("Error connecting to db:", err));

// Schema
const weatherSchema = new mongoose.Schema({
  city: String,
  country: String,
  temperature: Number,
  searchedAt: { type: Date, default: Date.now }
});

const Weather = mongoose.model("Weather", weatherSchema);

app.get("/", (req, res) => {
  res.json({
    message: "Weather API is running",
    routes: ["/search", "/history"]
  });
});

// POST route (save data)
app.post("/search", async (req, res) => {
  try {
    const { city, country, temperature } = req.body;

    const weather = new Weather({ city, country, temperature });
    await weather.save();

    res.status(201).json({ message: "Weather data saved successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" ,error: err.message});
  }
});

// GET route (history)
app.get("/history", async (req, res) => {
  try {
    const history = await Weather.find()
      .sort({ searchedAt: -1 })
      .limit(5);

    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server (ONLY ONCE)
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});