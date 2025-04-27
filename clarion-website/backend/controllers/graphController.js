// === backend/controllers/graphController.js ===

const Node = require('../models/node');
const Edge = require('../models/edge');

// =======================
// Create a Node
// =======================
exports.createNode = async (req, res) => {
  try {
    const { label, description, tags } = req.body;

    const newNode = new Node({
      label,
      description,
      tags
    });

    await newNode.save();
    res.status(201).json(newNode);
  } catch (error) {
    console.error('Error creating node:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// =======================
// Create an Edge
// =======================
exports.createEdge = async (req, res) => {
  try {
    const { fromNode, toNode, label } = req.body;

    const newEdge = new Edge({
      fromNode,
      toNode,
      label
    });

    await newEdge.save();
    res.status(201).json(newEdge);
  } catch (error) {
    console.error('Error creating edge:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// =======================
// Get All Nodes
// =======================
exports.getAllNodes = async (req, res) => {
  try {
    const nodes = await Node.find();
    res.json(nodes);
  } catch (error) {
    console.error('Error fetching nodes:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// =======================
// Get All Edges
// =======================
exports.getAllEdges = async (req, res) => {
  try {
    const edges = await Edge.find().populate('fromNode toNode', 'label');
    res.json(edges);
  } catch (error) {
    console.error('Error fetching edges:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// =======================
// Update a Node
// =======================
exports.updateNode = async (req, res) => {
  try {
    const { id } = req.params;
    const { label, description, tags } = req.body;

    const updatedNode = await Node.findByIdAndUpdate(
      id,
      { label, description, tags },
      { new: true }
    );

    if (!updatedNode) {
      return res.status(404).json({ message: 'Node not found' });
    }

    res.json(updatedNode);
  } catch (error) {
    console.error('Error updating node:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// =======================
// Delete a Node
// =======================
exports.deleteNode = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedNode = await Node.findByIdAndDelete(id);

    if (!deletedNode) {
      return res.status(404).json({ message: 'Node not found' });
    }

    res.json({ message: 'Node deleted successfully' });
  } catch (error) {
    console.error('Error deleting node:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// =======================
// Delete an Edge
// =======================
exports.deleteEdge = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedEdge = await Edge.findByIdAndDelete(id);

    if (!deletedEdge) {
      return res.status(404).json({ message: 'Edge not found' });
    }

    res.json({ message: 'Edge deleted successfully' });
  } catch (error) {
    console.error('Error deleting edge:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};