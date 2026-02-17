require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { syncDatabase } = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());


app.get('/api/weather', (req, res) => {
    res.json({ status : 'ok', message: 'Weather data endpoint is working!' });
});

app.use('/api', routes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false,
        error: 'Internal Server Error',
        message: err.message});
});

syncDatabase().then(() => {
    app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
    console.log(`API endpoints available at http://localhost:${PORT}/api`);
});
})





