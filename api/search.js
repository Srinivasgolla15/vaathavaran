const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

const cached = global.mongoose || (global.mongoose = { conn: null, promise: null });

async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    const opts = { bufferCommands: false };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    await dbConnect();

    const weatherSchema = new mongoose.Schema({
      city: String,
      country: String,
      temperature: Number,
      searchedAt: { type: Date, default: Date.now }
    });

    const Weather = mongoose.models.Weather || mongoose.model('Weather', weatherSchema);

    if (req.method === 'POST') {
      const { city, country, temperature } = req.body;
      const doc = new Weather({ city, country, temperature });
      await doc.save();
      return res.status(201).json({ message: 'Weather data saved' });
    }

    res.setHeader('Allow', 'POST,OPTIONS');
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
