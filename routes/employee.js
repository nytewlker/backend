const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');

const router = express.Router();

// Employee Registration
router.post('/register', async (req, res) => {
  const { name, email, password, resume } = req.body;

  try {
    let employee = await Employee.findOne({ email });
    if (employee) {
      return res.status(400).json({ msg: 'Employee already exists' });
    }

    employee = new Employee({
      name,
      email,
      password,
      resume
    });

    const salt = await bcrypt.genSalt(10);
    employee.password = await bcrypt.hash(password, salt);

    await employee.save();

    const payload = {
      employee: {
        id: employee.id
      }
    };

    jwt.sign(payload, 'jwtSecret', { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Employee Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let employee = await Employee.findOne({ email });
    if (!employee) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      employee: {
        id: employee.id
      }
    };

    jwt.sign(payload, 'jwtSecret', { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
