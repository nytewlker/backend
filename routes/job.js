const express = require('express');
const Job = require('../models/Job');
const auth = require('../middleware/auth');

const router = express.Router();

// Post a Job
router.post('/', auth, async (req, res) => {
  const { title, description } = req.body;

  try {
    const newJob = new Job({
      title,
      description,
      company: req.user.id
    });

    const job = await newJob.save();
    res.json(job);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().populate('company', ['name', 'company']);
    res.json(jobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Apply for a Job
router.put('/apply/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    job.applicants.push(req.user.id);
    await job.save();

    res.json(job);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
