const express = require('express');
const mongoose = require('mongoose');
const Student = require('../models/Student');
const router = express.Router();

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

router.post('/', async (req, res, next) => {
  try {
    const { name, marks, course } = req.body;

    const student = new Student({ name, marks, course });
    await student.save();

    res.status(201).json(student);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    next(error);
  }
});

router.get('/topper', async (req, res, next) => {
  try {
    const topper = await Student.findOne().sort({ marks: -1 }).limit(1);
    if (!topper) {
      return res.status(404).json({ message: 'No students found' });
    }
    res.json(topper);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!validateObjectId(id)) {
      return res.status(400).json({ message: 'Invalid student id' });
    }

    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!validateObjectId(id)) {
      return res.status(400).json({ message: 'Invalid student id' });
    }

    const { name, marks, course } = req.body;
    const student = await Student.findByIdAndUpdate(
      id,
      { name, marks, course },
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!validateObjectId(id)) {
      return res.status(400).json({ message: 'Invalid student id' });
    }

    const student = await Student.findByIdAndDelete(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
