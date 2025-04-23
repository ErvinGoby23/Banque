const db = require('../config/database');

class CryptoWallet {
    static async getCrypto(utilisateurId, crypto) {
        const [rows] = await db.getConnection().execute(
            "SELECT * FROM PortefeuilleCrypto WHERE utilisateur_id = ? AND crypto = ?",
            [utilisateurId, crypto]
        );
        return rows[0];
    }

    static async updateCrypto(utilisateurId, crypto, quantite) {
        const conn = db.getConnection();
        await conn.execute(
            "UPDATE PortefeuilleCrypto SET quantite = quantite + ? WHERE utilisateur_id = ? AND crypto = ?",
            [quantite, utilisateurId, crypto]
        );
    }

    static async createCrypto(utilisateurId, crypto, quantite) {
        const conn = db.getConnection();
        await conn.execute(
            "INSERT INTO PortefeuilleCrypto (utilisateur_id, crypto, quantite) VALUES (?, ?, ?)",
            [utilisateurId, crypto, quantite]
        );
    }
    static async getPortefeuille(utilisateurId) {
        const [rows] = await db.getConnection().execute(
            "SELECT crypto, quantite FROM PortefeuilleCrypto WHERE utilisateur_id = ?",
            [utilisateurId]
        );
        return rows;
    }
    static async vendreCrypto(utilisateurId, crypto, quantiteAVendre, cours) {
        const conn = db.getConnection();
        const montantEUR = quantiteAVendre * cours;
    
        try {
            await conn.beginTransaction();
    
            const [result] = await conn.execute(
                "SELECT quantite FROM PortefeuilleCrypto WHERE utilisateur_id = ? AND crypto = ? FOR UPDATE",
                [utilisateurId, crypto]
            );
    
            if (result.length === 0 || parseFloat(result[0].quantite) < quantiteAVendre) {
                throw new Error("Quantité insuffisante pour la vente");
            }
    
            await conn.execute(
                "UPDATE PortefeuilleCrypto SET quantite = quantite - ? WHERE utilisateur_id = ? AND crypto = ?",
                [quantiteAVendre, utilisateurId, crypto]
            );
    
            await conn.execute(
                "UPDATE Compte SET solde = solde + ? WHERE utilisateur_id = ? AND type_compte = 'courant'",
                [montantEUR, utilisateurId]
            );
    
            await conn.commit();
        } catch (err) {
            await conn.rollback();
            throw err;
        }
    }
    

    static async debiterSolde(utilisateurId, montantEUR) {
        const conn = db.getConnection();
        const [[{ solde }]] = await conn.execute(
            "SELECT solde FROM Compte WHERE utilisateur_id = ? AND type_compte = 'courant' FOR UPDATE",
            [utilisateurId]
        );
        if (solde < montantEUR) throw new Error("Solde insuffisant");

        await conn.execute(
            "UPDATE Compte SET solde = solde - ? WHERE utilisateur_id = ? AND type_compte = 'courant'",
            [montantEUR, utilisateurId]
        );
    }
}

module.exports = CryptoWallet;
