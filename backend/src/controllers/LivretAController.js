const LivretA = require('../models/LivretA');
const LivretATransaction = require('../models/LivretATransaction');

class LivretAController {
  static async getLivretAByUser(req, res) {
    try {
      const utilisateur = req.session.utilisateur;
      if (!utilisateur) return res.status(401).json({ error: "Non autorisé" });

      const livret = await LivretA.getByUserId(utilisateur.id);
      res.json(livret);
    } catch (error) {
      console.error("Erreur Livret A:", error.message);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }

  static async getTransactionsForUser(req, res) {
    try {
      const utilisateur = req.session.utilisateur;
      if (!utilisateur) return res.status(401).json({ error: "Non autorisé" });

      const livret = await LivretA.getByUserId(utilisateur.id);
      if (!livret) return res.status(404).json({ error: "Compte Livret A introuvable" });

      const rows = await LivretATransaction.getByCompteId(livret.id);
      res.json(rows);
    } catch (error) {
      console.error("Erreur transactions Livret A:", error.message);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }
}

module.exports = LivretAController;
