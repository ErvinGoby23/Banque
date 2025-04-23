const db = require('../config/database');

class LivretA {
  static async getByUserId(utilisateurId) {
    const [rows] = await db.getConnection().execute(
      "SELECT * FROM compte WHERE utilisateur_id = ? AND type_compte = 'livretA'",
      [utilisateurId]
    );
    return rows[0] || null;
  }
}

module.exports = LivretA;