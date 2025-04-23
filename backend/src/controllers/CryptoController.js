const CryptoService = require('../services/cryptoService');
const CryptoWallet = require('../models/CryptoWallet');

class CryptoController {
    static async getCryptoPrices(req, res) {
        try {
            const prices = await CryptoService.getPrices();
            res.json(prices);
        } catch (error) {
            console.error("Erreur Crypto API :", error.message);
            res.status(500).json({ error: "Erreur serveur" });
        }
    }
    static async getPortefeuille(req, res) {
        try {
            const utilisateurId = req.session.utilisateur?.id;
            if (!utilisateurId) return res.status(401).json({ error: "Non autorisé" });
    
            const cryptos = await CryptoWallet.getPortefeuille(utilisateurId);
            res.json(cryptos);
        } catch (error) {
            console.error("Erreur portefeuille crypto :", error.message);
            res.status(500).json({ error: "Erreur serveur" });
        }
    }
    static async vendreCrypto(req, res) {
        try {
            const utilisateurId = req.session.utilisateur?.id;
            if (!utilisateurId) return res.status(401).json({ error: "Non autorisé" });
    
            const { crypto, quantite } = req.body;
            const prices = await CryptoService.getPrices();
    
            const idMap = {
                BTC: 'bitcoin',
                ETH: 'ethereum',
                SOL: 'solana'
            };
    
            if (!prices[idMap[crypto]]) throw new Error("Crypto non supportée");
    
            const cours = prices[idMap[crypto]].eur;
    
            await CryptoWallet.vendreCrypto(utilisateurId, crypto, parseFloat(quantite), cours);
    
            res.json({ message: `Vente réussie : ${quantite} ${crypto}` });
        } catch (error) {
            console.error("Erreur vente crypto :", error.message);
            res.status(400).json({ error: error.message });
        }
    }
    
    

    static async acheterCrypto(req, res) {
        try {
            const utilisateurId = req.session.utilisateur?.id;
            if (!utilisateurId) return res.status(401).json({ error: "Non autorisé" });

            const { crypto, montantEUR } = req.body;
            const prices = await CryptoService.getPrices();

            const idMap = {
                BTC: 'bitcoin',
                ETH: 'ethereum',
                SOL: 'solana'
            };

            if (!prices[idMap[crypto]]) throw new Error("Crypto non supportée");

            const cours = prices[idMap[crypto]].eur;
            const quantite = montantEUR / cours;

            await CryptoWallet.debiterSolde(utilisateurId, montantEUR);

            const existing = await CryptoWallet.getCrypto(utilisateurId, crypto);
            if (existing) {
                await CryptoWallet.updateCrypto(utilisateurId, crypto, quantite);
            } else {
                await CryptoWallet.createCrypto(utilisateurId, crypto, quantite);
            }

            res.json({ message: `Achat réussi : ${quantite.toFixed(8)} ${crypto}` });
        } catch (error) {
            console.error("Erreur achat crypto :", error.message);
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = CryptoController;
