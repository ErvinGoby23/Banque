const Transaction = require('../models/Transaction');
const db = require('../config/database'); 

class TransactionController {
    static async virement(req, res) {
        try {
            const expediteurId = req.session.utilisateur?.id;
            const { destinataireId, montant } = req.body;

            if (!expediteurId) return res.status(401).json({ error: "Non autorisé" });

            await Transaction.effectuerVirement(expediteurId, destinataireId, parseFloat(montant));
            res.json({ message: "Virement effectué avec succès" });
        } catch (error) {
            console.error("Erreur virement :", error.message);
            res.status(400).json({ error: error.message });
        }
    }
    static async getHistorique(req, res) {
        try {
            const utilisateurId = req.session.utilisateur?.id;
            if (!utilisateurId) return res.status(401).json({ error: "Non autorisé" });

            const historique = await Transaction.getHistorique(utilisateurId);
            res.json(historique);
        } catch (error) {
            console.error("Erreur historique transactions :", error.message);
            res.status(500).json({ error: "Erreur serveur" });
        }
    }
    static async virementLivretA(req, res) {
        try {
            const utilisateurId = req.session.utilisateur?.id;
            if (!utilisateurId) return res.status(401).json({ error: "Non autorisé" });

            const { montant, typeTransaction } = req.body;

            if (!montant || montant <= 0) {
                return res.status(400).json({ error: "Montant invalide" });
            }

            let result;

            if (typeTransaction === 'courant-to-livretA') {
                result = await Transaction.virementCourantToLivretA(utilisateurId, montant);
            } 
            else if (typeTransaction === 'livretA-to-courant') {
                result = await Transaction.virementLivretAToCourant(utilisateurId, montant);
            } else {
                return res.status(400).json({ error: "Type de transaction invalide" });
            }

            res.json(result);
        } catch (error) {
            console.error("Erreur virement Livret A:", error.message);
            res.status(500).json({ error: "Erreur serveur" });
        }
    }
    
}

module.exports = TransactionController;
