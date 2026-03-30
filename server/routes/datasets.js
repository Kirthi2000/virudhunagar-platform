const express = require('express');
const router = express.Router();
const { createDataset, getDatasets, downloadDataset } = require('../controllers/datasetController');
const { protect } = require('../middleware/auth');

router.get('/', getDatasets);
router.post('/', protect, createDataset);
router.get('/:id/download', protect, downloadDataset);

module.exports = router;
