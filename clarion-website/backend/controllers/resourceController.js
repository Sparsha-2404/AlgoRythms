// === controllers/resourceController.js ===

const Resource = require('../models/resource');

// Helper function to calculate smart score
const calculateScore = (resource, inputTags) => {
  let score = 0;

  // Increase score if tags match
  inputTags.forEach(tag => {
    if (resource.tags.includes(tag)) score += 10;
  });

  // Boost with rating
  score += (resource.rating || 0) * 5;

  // Boost with popularity (scaled)
  score += (resource.popularity || 0) / 500;

  return score;
};

// POST /api/resources/recommend
exports.recommendResources = async (req, res) => {
  const { tags } = req.body;

  if (!tags || !Array.isArray(tags) || tags.length === 0) {
    return res.status(400).json({ msg: 'Tags array is required' });
  }

  try {
    // Find potential resources
    const resources = await Resource.find({
      tags: { $in: tags }
    });

    if (resources.length === 0) {
      return res.status(404).json({ msg: 'No matching resources found' });
    }

    // Calculate scores
    const scoredResources = resources.map(resource => ({
      ...resource._doc,
      smartScore: calculateScore(resource, tags)
    }));

    // Sort by score descending
    scoredResources.sort((a, b) => b.smartScore - a.smartScore);

    // Return top 5
    res.json(scoredResources.slice(0, 5));

  } catch (err) {
    console.error('Error recommending resources:', err.message);
    res.status(500).send('Server error');
  }
};
