// === routes/resource.js ===

const express = require('express');
const router = express.Router();
const { recommendResources } = require('../controllers/resourceController');

// @route    POST /api/resources/recommend
// @desc     Recommend best learning resources based on tags
// @access   Public
router.post('/recommend', recommendResources);

module.exports = router;
