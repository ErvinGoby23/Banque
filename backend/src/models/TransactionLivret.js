const db = require('../config/database');

class TransactionLivret {
    static async getByUserId(utilisateurId) {
        const conn = db.getConnection();
        const [rows] = await conn.execute(
          `
          SELECT tl.* FROM transaction_livret tl
          JOIN compte c ON c.id = tl.compte_id
          WHERE c.utilisateur_id = ? AND c.type_compte = 'livretA'
          ORDER BY tl.date_transaction DESC
          `,
          [utilisateurId]
        );
        return rows;
      }
      
}

module.exports = TransactionLivret;
