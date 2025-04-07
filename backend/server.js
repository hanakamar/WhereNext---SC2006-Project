require('dotenv').config();


const cors = require('cors');
const express = require('express');

const app = express();
const savedlocationsRoutes = require('./routes/savedlocations');
const profileRoutes = require('./routes/profile');
const plannerRoutes = require('./routes/plannerRoutes');
const { default: mongoose } = require('mongoose');

app.use(express.json());
app.use(cors());


// Middleware to log requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/savedLocations', savedlocationsRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/planner', plannerRoutes);

// Connect to MongoDB
console.log("🔌 Connecting to MongoDB...");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log("✅ Successfully connected to MongoDB");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✅ Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error.message);
  });

app.use((req, res, next) => {
  console.log(`[SERVER LOG] ${req.method} ${req.path}`);
  next();
});

app.get('/api/test', (req, res) => {
  console.log("✅ Backend received /api/test");
  res.json({ message: "Backend is working!" });
});