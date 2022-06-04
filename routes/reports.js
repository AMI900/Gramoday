const express = require('express');
const { addReport, getReports } = require('../controllers/reports');
const router = express.Router();

router.route('/').post(addReport).get(getReports);

module.exports = router;
