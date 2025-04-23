const express = require('express');
const TransactionController = require('../controllers/TransactionController');
const router = express.Router();

router.post('/virement', TransactionController.virement);
router.get('/historique', TransactionController.getHistorique);
router.post('/virement-livretA', TransactionController.virementLivretA);
module.exports = router;

