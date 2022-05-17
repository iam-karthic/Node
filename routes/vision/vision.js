const express = require('express');

const router = express.Router();
const GpxParser = require('gpxparser');
const { getS3file } = require('../../helpers/s3');
const pool = require('../../helpers/mysql');

router.get('/gpx', async (req, res) => {
  try {
    const file = await getS3file('sample.gpx');
    const gpx = new GpxParser();
    gpx.parse(file);

    const geoJSON = gpx.toGeoJSON();
    res.status(200).json(geoJSON);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/attachments/:projectId', async (req, res) => {
  try {
    const result = await pool.query('SELECT CONCAT(?, file_path, "/", file_name) as attachment FROM project_document WHERE project = ?', [process.env.S3_ATTACHMENTS_BUCKET_URL, req.params.projectId]);
    res.status(200).json(result[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/media/video/:projectId', async (req, res) => {
  try {
    const result = await pool.query('SELECT CONCAT(?, file_path, "/videos/", file_name) as media FROM project_media WHERE project = ?', [process.env.S3_MEDIA_BUCKET_URL, req.params.projectId]);
    res.status(200).json(result[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/media/frame/:projectId', async (req, res) => {
  try {
    const result = await pool.query('SELECT CONCAT(?, file_path, "/frames/", file_type, "/",file_name) as media FROM project_media WHERE project = ?', [process.env.S3_MEDIA_BUCKET_URL, req.params.projectId]);
    res.status(200).json(result[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/objects/:projectId', async (req, res) => {
  try {
    const result = await pool.query('SELECT CONCAT(?, file_path, "/", file_name) as objects FROM project_objects WHERE project = ?', [process.env.S3_OBJECTS_BUCKET_URL, req.params.projectId]);
    res.status(200).json(result[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
