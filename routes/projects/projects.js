const express = require('express');

const router = express.Router();
const pool = require('../../helpers/mysql');
const mongo = require('../../helpers/mongo');

router.get('/', async (req, res) => {
  try {
    let projects = [];
    const selected = await pool.query('SELECT GROUP_CONCAT(project_id) as project_ids FROM project_user_mapping WHERE user_id = ?', [req.loginUserId]);
    const result = await pool.query('SELECT GROUP_CONCAT(project_id) as project_ids FROM project');
    const project = await mongo('projects');
    if (result[0][0].project_ids) {
      projects = await project.find({ project_id: { $in: result[0][0].project_ids.split(',') } }).project({ info: 1, _id: 0 }).toArray();
      projects.forEach((x) => {
        // eslint-disable-next-line no-param-reassign
        x.selected = selected[0][0].project_ids && selected[0][0].project_ids.split(',').includes(x.info.project_id);
      });
    }
    res.status(200).json({ data: projects });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/get/:id', async (req, res) => {
  try {
    const projects = await mongo('projects');
    const result = await projects.find({ project_id: req.params.id }).toArray();
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/myprojects', async (req, res) => {
  try {
    const result = await pool.query('SELECT GROUP_CONCAT(project_id) as project_ids FROM project_user_mapping WHERE user_id = ?', [req.loginUserId]);
    const projects = await mongo('projects');
    let myprojects = [];
    if (result[0][0].project_ids) {
      myprojects = await projects.find({ project_id: { $in: result[0][0].project_ids.split(',') } }).toArray();
    }
    res.status(201).json({ data: myprojects });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') res.status(400).json({ message: 'Project already added' });
    else res.status(500).json({ message: err.message });
  }
});

router.get('/myprojects/add/:projectId', async (req, res) => {
  try {
    await pool.query('INSERT INTO project_user_mapping(user_id, project_id) VALUES (?,?)', [req.loginUserId, req.params.projectId]);
    res.status(200).json({ projectId: req.params.projectId, message: 'Project added to User' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') res.status(400).json({ projectId: req.params.projectId, message: 'Project already added' });
    else res.status(500).json({ message: err.message });
  }
});

router.get('/myprojects/remove/:projectId', async (req, res) => {
  try {
    await pool.query('DELETE FROM project_user_mapping WHERE user_id = ? AND project_id = ?', [req.loginUserId, req.params.projectId]);
    res.status(200).json({ projectId: req.params.projectId, message: 'Project removed from User' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
