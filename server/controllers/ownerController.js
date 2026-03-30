const User = require('../models/User');

const MAX_OWNERS = 2;

// GET /api/owner/users  — list all users (owner dashboard)
exports.listUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// PATCH /api/owner/promote/:id  — promote a user to owner (max 2)
exports.promoteToOwner = async (req, res) => {
  try {
    const ownerCount = await User.countDocuments({ role: 'owner' });
    if (ownerCount >= MAX_OWNERS)
      return res.status(400).json({ message: `Maximum ${MAX_OWNERS} owners allowed` });

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: 'owner' },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: `${user.name} is now an owner`, user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to promote user' });
  }
};

// PATCH /api/owner/demote/:id  — demote an owner back to their previous role
exports.demoteOwner = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString())
      return res.status(400).json({ message: 'You cannot demote yourself' });

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: 'student' },           // fallback role after demotion
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: `${user.name} has been demoted`, user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to demote user' });
  }
};

// DELETE /api/owner/users/:id  — remove any user or content
exports.deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString())
      return res.status(400).json({ message: 'You cannot delete yourself' });

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
};
