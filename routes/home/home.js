const express = require('express');

const router = express.Router();
const pool = require('../../helpers/mysql');
const mongo = require('../../helpers/mongo');

const data = require('../../constants/data.json');

router.post('/', async (req, res) => {
  try {
    const {
      search, state, district, expiration,
    } = req.body;
    const page = 10;

    const result = await pool.query('SELECT * FROM project');
    res.status(200).json({ projects: result[0], data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/state', async (req, res) => {
  try {
    const project = await mongo('projects');
    const projects = await project.distinct('info.state');
    res.status(200).json({ data: projects });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/district', async (req, res) => {
  try {
    const project = await mongo('projects');
    const projects = await project.distinct('info.district');
    res.status(200).json({ data: projects });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
