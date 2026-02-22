const express = require('express');
const router = express.Router();

// Basic health check route: GET /api/health
router.get('/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'Server is running smoothly!',
    database: 'SQLite configured'
  });
});

module.exports = router;