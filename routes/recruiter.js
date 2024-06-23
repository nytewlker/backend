const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Recruiter = require('../models/Recruiter');
const  verify = require('../middleware/auth.js')

const router = express.Router();

// Recruiter Registration
router.post('/register', async (req, res) => {
  const { name, email, password, company } = req.body;
  try {
    let recruiter = await Recruiter.findOne({ email });
    if (recruiter) {
      return res.status(400).json({ data:recruiter, msg: 'Recruiter already exists' });
    }

    recruiter = new Recruiter({
      name,
      email,
      password,
      company
    });

    const salt = await bcrypt.genSalt(10);
    recruiter.password = await bcrypt.hash(password, salt);

    await recruiter.save();

    const payload = {
      recruiter: {
        id: recruiter.id
      }
    };

    jwt.sign(payload, 'jwtSecret', { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token,recruiter });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Recruiter Login
router.post('/login',verify, async (req, res) => {
  const { email, password } = req.body;

  try {
    let recruiter = await Recruiter.findOne({ email });
    if (!recruiter) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, recruiter.password);
    if (!isMatch) {
      return res.status(400).json({data:recruiter,  msg: 'Invalid Credentials' });
    }

    const payload = {
      recruiter: {
        id: recruiter.id
      }
    };

    jwt.sign(payload, 'jwtSecret', { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token ,recruiter});
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;