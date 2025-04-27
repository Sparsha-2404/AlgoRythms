// === backend/routes/api.js ===

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { registerUser, loginUser } = require('../controllers/auth');


// Import Graph Controllers
const {
  createNode,
  createEdge,
  getAllNodes,
  getAllEdges,
  updateNode,
  deleteNode,
  deleteEdge,
} = require('../controllers/graphController');

// Import User Controllers
const {
  getUser,
  getAllUsers
} = require('../controllers/userController');

// ========================
// Graph Routes
// ========================

// Create a node
router.post('/nodes', auth, createNode);

// Create an edge
router.post('/edges', auth, createEdge);

// Get all nodes
router.get('/nodes', getAllNodes);

// Get all edges
router.get('/edges', getAllEdges);

// Update a node
router.put('/nodes/:id', auth, updateNode);

// Delete a node
router.delete('/nodes/:id', auth, deleteNode);

// Delete an edge
router.delete('/edges/:id', auth, deleteEdge);

// ========================
// User Routes
// ========================

// Get current logged-in user's profile
router.get('/user', auth, getUser);

// Get all users (optional for admin)
router.get('/users', getAllUsers);

router.post('/auth/register',registerUser);
router.post('/auth/login',loginUser);


module.exports = router;