require('dotenv').config();

const cors = require('cors');
const express = require('express');

const app = express();
const feedRoutes = require('./routes/feed');
const savedlocationsRoutes = require('./routes/savedlocations');
const profileRoutes = require('./routes/profile');
const { default: mongoose } = require('mongoose');

app.use(express.json());
app.use(cors());

// Middleware
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
})



// Routes
app.use('/api/feed', feedRoutes);
app.use('/api/listing', savedlocationsRoutes);
app.use('/api/profile', profileRoutes);
// Connect to database
mongoose.connect(process.env.MONGO_URI).then(() => {
    // listen to request
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    })
}).catch((error) => { console.log(error) });


