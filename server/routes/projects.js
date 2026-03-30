const express = require('express');
const router = express.Router();
const { createProject, getProjects, getProject, rateProject, commentProject, bookmarkProject } = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getProjects);
router.get('/:id', getProject);
router.post('/', protect, authorize('student', 'faculty'), createProject);
router.post('/:id/rate', protect, rateProject);
router.post('/:id/comment', protect, commentProject);
router.post('/:id/bookmark', protect, bookmarkProject);

module.exports = router;
