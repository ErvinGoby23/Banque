const Compte = require('../models/Compte');

class CompteController {
    static async getSolde(req, res) {
        try {
            const utilisateur = req.session.utilisateur;
            if (!utilisateur) return res.status(401).json({ error: "Non autorisé" });

            const comptes = await Compte.getSoldeByUserId(utilisateur.id);
            res.json(comptes);
        } catch (error) {
            console.error("Erreur lors de la récupération du solde :", error.message);
            res.status(500).json({ error: "Erreur interne serveur" });
        }
    }
}

module.exports = CompteController;
