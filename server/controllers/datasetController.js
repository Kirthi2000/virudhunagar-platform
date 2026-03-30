const Dataset = require('../models/Dataset');

exports.createDataset = async (req, res) => {
  try {
    const { title, description, category, format, size } = req.body;
    if (!title || !description || !category)
      return res.status(400).json({ message: 'Title, description and category are required' });

    const dataset = await Dataset.create({
      title, description, category,
      format: format || '',
      size: size || '',
      uploadedBy: req.user._id,
    });
    res.status(201).json(dataset);
  } catch (err) {
    console.error('Create dataset error:', err);
    res.status(500).json({ message: 'Failed to create dataset' });
  }
};

exports.getDatasets = async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (search) filter.$or = [
      { title: new RegExp(search, 'i') },
      { description: new RegExp(search, 'i') },
    ];
    const datasets = await Dataset.find(filter).sort({ createdAt: -1 }).populate('uploadedBy', 'name institution');
    res.json(datasets);
  } catch (err) {
    console.error('Get datasets error:', err);
    res.status(500).json({ message: 'Failed to fetch datasets' });
  }
};

exports.downloadDataset = async (req, res) => {
  try {
    const dataset = await Dataset.findById(req.params.id);
    if (!dataset) return res.status(404).json({ message: 'Dataset not found' });

    if (!dataset.file?.url) {
      return res.status(400).json({ message: 'This dataset does not have a downloadable file yet' });
    }

    dataset.downloads += 1;
    await dataset.save();

    res.json({ url: dataset.file.url });
  } catch (err) {
    console.error('Download dataset error:', err);
    res.status(500).json({ message: 'Failed to download dataset' });
  }
};
