const db = require('../config/database');

class Compte {
    static async getSoldeByUserId(utilisateurId) {
        const [rows] = await db.getConnection().execute(
            "SELECT numero_compte, solde, type_compte FROM Compte WHERE utilisateur_id = ?",
            [utilisateurId]
        );
        return rows;
    }
    static async getByUserIdAndType(utilisateurId, typeCompte) {
        const conn = db.getConnection();
        const [rows] = await conn.execute(
            "SELECT * FROM Compte WHERE utilisateur_id = ? AND type_compte = ?",
            [utilisateurId, typeCompte]
        );
        return rows;
    }
    static async crediterSolde(utilisateurId, montant) {
        const [result] = await db.getConnection().execute(
            "UPDATE Compte SET solde = solde + ? WHERE utilisateur_id = ?",
            [montant, utilisateurId]
        );
        return result;
    }
    
}

module.exports = Compte;
