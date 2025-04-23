const db = require('../config/database');

class LivretATransaction {
  static async getByCompteId(compteId) {
    const [rows] = await db.getConnection().execute(
      "SELECT * FROM transaction_livret WHERE compte_id = ? ORDER BY date_transaction DESC",
      [compteId]
    );
    return rows;
  }

  static async ajouterTransaction(compteId, montant, type) {
    await db.getConnection().execute(
      "INSERT INTO transaction_livret (compte_id, montant, type) VALUES (?, ?, ?)",
      [compteId, montant, type]
    );
  }
}

module.exports = LivretATransaction;
