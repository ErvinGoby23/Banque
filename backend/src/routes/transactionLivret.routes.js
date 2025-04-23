const express = require('express');
const TransactionLivretController = require('../controllers/TransactionLivretController');
const router = express.Router();

router.get('/historique', TransactionLivretController.getByUser);

module.exports = router;
