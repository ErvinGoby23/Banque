const TransactionLivret = require('../models/TransactionLivret');

class TransactionLivretController {
  static async getByUser(req, res) {
    try {
      const utilisateurId = req.session.utilisateur?.id;
      if (!utilisateurId) return res.status(401).json({ error: "Non autorisé" });

      const transactions = await TransactionLivret.getByUserId(utilisateurId);
      res.json(transactions);
    } catch (error) {
      console.error("Erreur historique Livret A :", error.message);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }
}

module.exports = TransactionLivretController;
