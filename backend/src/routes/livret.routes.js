const express = require('express');
const router = express.Router();
const LivretAController = require('../controllers/LivretAController');

router.get('/', LivretAController.getLivretAByUser);
router.get('/transactions', LivretAController.getTransactionsForUser);

module.exports = router;
