const express = require('express');

const router = express.Router();

router.get('/home', (req, res) => {
  res.send({
    msg: 'Logged In',
    userId: req.loginUserId,
    email: req.loginUserEmail,
  });
});

module.exports = router;
