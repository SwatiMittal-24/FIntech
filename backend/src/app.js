const express = require('express');
const cors = require('cors');
const indexRoutes = require('./routes/indexRoutes');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

const app = express();

// 1. Global Middlewares
app.use(cors()); // Allow requests from a frontend
app.use(express.json()); // Allow Express to parse JSON bodies
app.use(express.urlencoded({ extended: true }));

// 2. Routes
app.use('/api', indexRoutes);

// 3. Error Handling Middlewares (Must be at the end)
app.use(notFound);
app.use(errorHandler);

module.exports = app;