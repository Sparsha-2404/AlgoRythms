const User = require('../models/user');
const Node = require('../models/node');
const Edge = require('../models/edge');
const bcrypt = require('bcryptjs');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    // Get user without password
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  const { name, organization, bio, interests, avatar } = req.body;
  
  // Build profile object
  const profileFields = {};
  if (name) profileFields.name = name;
  if (organization) profileFields.organization = organization;
  if (bio) profileFields.bio = bio;
  if (interests) profileFields.interests = interests;
  if (avatar) profileFields.avatar = avatar;
  
  try {
    // Update user
    let user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: profileFields },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get user activity - nodes and edges created
exports.getUserActivity = async (req, res) => {
  try {
    // Get nodes created by user
    const nodes = await Node.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);
    
    // Get edges created by user
    const edges = await Edge.find({ user: req.user.id })
      .populate('source target', 'title type')
      .sort({ createdAt: -1 })
      .limit(20);
    
    res.json({ nodes, edges });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get user statistics
exports.getUserStats = async (req, res) => {
  try {
    // Count nodes by type
    const nodesByType = await Node.aggregate([
      { $match: { user: req.user.id } },
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);
    
    // Count total edges
    const totalEdges = await Edge.countDocuments({ user: req.user.id });
    
    // Count public vs private nodes
    const publicNodes = await Node.countDocuments({ 
      user: req.user.id,
      isPublic: true
    });
    
    const privateNodes = await Node.countDocuments({ 
      user: req.user.id,
      isPublic: false
    });
    
    // Get node creation over time
    const nodeCreationTimeline = await Node.aggregate([
      { $match: { user: req.user.id } },
      { 
        $project: {
          month: { $month: '$createdAt' },
          year: { $year: '$createdAt' }
        }
      },
      {
        $group: {
          _id: { month: '$month', year: '$year' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    
    res.json({
      nodesByType,
      totalEdges,
      publicNodes,
      privateNodes,
      nodeCreationTimeline
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get users for collaboration (excluding current user)
exports.getCollaborators = async (req, res) => {
  try {
    // Find users with similar interests or organization
    const currentUser = await User.findById(req.user.id);
    
    if (!currentUser) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    let query = {
      _id: { $ne: req.user.id } // Exclude current user
    };
    
    // If user has organization, find users from same organization
    if (currentUser.organization) {
      query.organization = currentUser.organization;
    }
    
    // Find potential collaborators
    const users = await User.find(query)
      .select('name organization role avatar bio interests')
      .limit(10);
    
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Change password
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  try {
    // Get user with password
    const user = await User.findById(req.user.id);
    
    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Current password is incorrect' });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    // Save user
    await user.save();
    
    res.json({ msg: 'Password updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Delete user account and all associated data
exports.deleteAccount = async (req, res) => {
  try {
    // Delete all nodes created by user
    await Node.deleteMany({ user: req.user.id });
    
    // Delete all edges created by user
    await Edge.deleteMany({ user: req.user.id });
    
    // Delete user
    await User.findByIdAndRemove(req.user.id);
    
    res.json({ msg: 'User account deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get public user profile (for viewing other users)
exports.getPublicProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('name organization role avatar bio createdAt');
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Get count of public nodes by this user
    const publicNodesCount = await Node.countDocuments({
      user: req.params.userId,
      isPublic: true
    });
    
    res.json({
      user,
      publicNodesCount
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server error');
  }
};


// Get logged-in user info
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};