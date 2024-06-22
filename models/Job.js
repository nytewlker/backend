const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recruiter',
    required: true
  },
  applicants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  }]
});

module.exports = mongoose.model('Job', jobSchema);
