const User = require('../models/User');
const Project = require('../models/Project');

exports.getLeaderboard = async (req, res) => {
  try {
    const { type } = req.query;

    if (type === 'institutions') {
      const data = await User.aggregate([
        { $match: { role: { $in: ['student', 'faculty'] }, institution: { $exists: true, $ne: '' } } },
        { $group: { _id: '$institution', totalScore: { $sum: '$score' }, members: { $sum: 1 } } },
        { $sort: { totalScore: -1 } },
        { $limit: 20 },
      ]);
      return res.json(data);
    }

    const users = await User.find({ role: 'student' })
      .select('name institution score avatar department')
      .sort({ score: -1 })
      .limit(20);

    const leaderboard = await Promise.all(users.map(async (u) => {
      const projectCount = await Project.countDocuments({ author: u._id });
      return { ...u.toObject(), projectCount };
    }));

    res.json(leaderboard);
  } catch (err) {
    console.error('Leaderboard error:', err);
    res.status(500).json({ message: 'Failed to fetch leaderboard' });
  }
};
