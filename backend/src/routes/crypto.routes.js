const express = require('express');
const CryptoController = require('../controllers/CryptoController');
const router = express.Router();

router.get('/cours', CryptoController.getCryptoPrices);
router.post('/acheter', CryptoController.acheterCrypto);
router.get('/portefeuille', CryptoController.getPortefeuille);
router.post('/vendre', CryptoController.vendreCrypto);



module.exports = router;
