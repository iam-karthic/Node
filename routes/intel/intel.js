const express = require('express');

const router = express.Router();
const mongo = require('../../helpers/mongo');
const pool = require('../../helpers/mysql');

router.get('/summary/:id', async (req, res) => {
  try {
    const projects = await mongo('projects');
    const result = await projects.find({ project_id: req.params.id }).toArray();
    const result2 = await pool.query('SELECT CONCAT(?, file_path, "/", file_name) as attachment FROM project_document WHERE project = ?', [process.env.S3_ATTACHMENTS_BUCKET_URL, req.params.id]);
    res.status(200).send({
      data: {
        project_id: result[0].project_id,
        ...result[0].project_summary,
        attachments: result2[0],
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/description/:id', async (req, res) => {
  try {
    const projects = await mongo('projects');
    const result = await projects.find({ project_id: req.params.id }).toArray();
    res.status(200).send({
      data: {
        project_id: result[0].project_id,
        ...result[0].project_description,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/timeline/:id', async (req, res) => {
  try {
    const projects = await mongo('projects');
    const result = await projects.find({ project_id: req.params.id }).toArray();
    res.status(200).send({
      data: {
        project_id: result[0].project_id,
        ...result[0].project_timeline,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/award/:id', async (req, res) => {
  try {
    const projects = await mongo('projects');
    const result = await projects.find({ project_id: req.params.id }).toArray();
    res.status(200).send({
      data: {
        project_id: result[0].project_id,
        ...result[0].project_award,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/analysis/:id', (req, res) => {
  res.status(200).send({ data: {} });
});

router.get('/contacts/:id', (req, res) => {
  res.status(200).send({ data: {} });
});

module.exports = router;
