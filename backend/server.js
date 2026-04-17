const express = require('express');
const cors = require('cors');

// Initialize Express application
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to handle Cross-Origin Resource Sharing
app.use(cors());

// Basic health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Node.js API is running successfully!'
    });
});

// Define the port, defaulting to 3000 if not provided in environment variables
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
