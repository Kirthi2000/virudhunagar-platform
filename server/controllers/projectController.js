const Project = require('../models/Project');
const User = require('../models/User');

exports.createProject = async (req, res) => {
  try {
    const { title, description, domain, technologies, githubLink, hasDataset, institution } = req.body;

    const project = await Project.create({
      title,
      description,
      domain,
      technologies: technologies ? technologies.split(',').map(t => t.trim()).filter(Boolean) : [],
      githubLink: githubLink || '',
      hasDataset: hasDataset === 'true' || hasDataset === true,
      institution: institution || req.user.institution || '',
      author: req.user._id,
    });

    await User.findByIdAndUpdate(req.user._id, { $inc: { score: 5 } });
    res.status(201).json(project);
  } catch (err) {
    console.error('Create project error:', err);
    res.status(500).json({ message: 'Failed to create project' });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const { domain, technology, institution, hasDataset, search, sort } = req.query;
    const filter = {};

    if (domain) filter.domain = domain;
    if (institution) filter.institution = new RegExp(institution, 'i');
    if (hasDataset === 'true') filter.hasDataset = true;
    if (technology) filter.technologies = { $in: [new RegExp(technology, 'i')] };
    if (search) filter.$or = [
      { title: new RegExp(search, 'i') },
      { description: new RegExp(search, 'i') },
      { technologies: { $in: [new RegExp(search, 'i')] } },
    ];

    const sortOption = sort === 'rating' ? { avgRating: -1 } : sort === 'views' ? { views: -1 } : { createdAt: -1 };
    const projects = await Project.find(filter).sort(sortOption).populate('author', 'name institution role');
    res.json(projects);
  } catch (err) {
    console.error('Get projects error:', err);
    res.status(500).json({ message: 'Failed to fetch projects' });
  }
};

exports.getProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id, { $inc: { views: 1 } }, { new: true }
    ).populate('author', 'name institution role avatar').populate('comments.user', 'name');

    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    console.error('Get project error:', err);
    res.status(500).json({ message: 'Failed to fetch project' });
  }
};

exports.rateProject = async (req, res) => {
  try {
    const { stars } = req.body;
    if (!stars || stars < 1 || stars > 5)
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.author.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot rate your own project' });
    }

    const existing = project.ratings.find(r => r.user.toString() === req.user._id.toString());
    if (existing) {
      existing.stars = stars;
    } else {
      project.ratings.push({ user: req.user._id, stars });
    }

    project.totalRatings = project.ratings.length;
    project.avgRating = project.ratings.reduce((a, r) => a + r.stars, 0) / project.totalRatings;
    await project.save();

    if (!existing) {
      await User.findByIdAndUpdate(project.author, { $inc: { score: 2 } });
    }
    res.json({ avgRating: project.avgRating, totalRatings: project.totalRatings });
  } catch (err) {
    console.error('Rate project error:', err);
    res.status(500).json({ message: 'Failed to rate project' });
  }
};

exports.commentProject = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ message: 'Comment cannot be empty' });

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    project.comments.push({ user: req.user._id, text: text.trim() });
    await project.save();

    await User.findByIdAndUpdate(project.author, { $inc: { score: 1 } });

    const updated = await Project.findById(req.params.id).populate('comments.user', 'name');
    res.json(updated.comments);
  } catch (err) {
    console.error('Comment error:', err);
    res.status(500).json({ message: 'Failed to add comment' });
  }
};

exports.bookmarkProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const idx = project.bookmarks.findIndex(b => b.toString() === req.user._id.toString());
    if (idx > -1) {
      project.bookmarks.splice(idx, 1);
    } else {
      project.bookmarks.push(req.user._id);
    }
    await project.save();
    res.json({ bookmarked: idx === -1, total: project.bookmarks.length });
  } catch (err) {
    console.error('Bookmark error:', err);
    res.status(500).json({ message: 'Failed to bookmark project' });
  }
};
