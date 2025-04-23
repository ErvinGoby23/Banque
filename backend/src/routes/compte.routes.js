const express = require('express');
const CompteController = require('../controllers/CompteController');
const router = express.Router();

router.get('/solde', CompteController.getSolde);

module.exports = router;
