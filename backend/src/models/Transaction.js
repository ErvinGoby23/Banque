const db = require('../config/database');

class Transaction {
    static async effectuerVirement(expediteurId, destinataireId, montant) {
        const conn = db.getConnection();

        try {
            await conn.beginTransaction();

            if (expediteurId === parseInt(destinataireId))
                throw new Error("Impossible de vous faire un virement à vous-même");

            const [[{ solde }]] = await conn.execute(
                "SELECT solde FROM Compte WHERE utilisateur_id = ? AND type_compte = 'courant' FOR UPDATE",
                [expediteurId]
            );
            if (solde < montant) throw new Error("Solde insuffisant");

            await conn.execute(
                "UPDATE Compte SET solde = solde - ? WHERE utilisateur_id = ? AND type_compte = 'courant'",
                [montant, expediteurId]
            );

            await conn.execute(
                "UPDATE Compte SET solde = solde + ? WHERE utilisateur_id = ? AND type_compte = 'courant'",
                [montant, destinataireId]
            );

            await conn.execute(
                "INSERT INTO Transaction (expediteur_id, destinataire_id, montant) VALUES (?, ?, ?)",
                [expediteurId, destinataireId, montant]
            );

            await conn.commit();
        } catch (err) {
            await conn.rollback();
            throw err;
        }
    }
    static async getHistorique(utilisateurId) {
        const conn = db.getConnection();
        const [rows] = await conn.execute(`
            SELECT 
                t.id, t.montant, t.date_transaction, 
                t.expediteur_id, t.destinataire_id,

                u1.nom AS expediteur_nom,
                u1.prenom AS expediteur_prenom,
                u1.email AS expediteur_email,

                u2.nom AS destinataire_nom,
                u2.prenom AS destinataire_prenom,
                u2.email AS destinataire_email

            FROM Transaction t
            JOIN User u1 ON t.expediteur_id = u1.id
            JOIN User u2 ON t.destinataire_id = u2.id
            WHERE t.expediteur_id = ? OR t.destinataire_id = ?
            ORDER BY t.date_transaction DESC
        `, [utilisateurId, utilisateurId]);
        return rows;
    }
    static async virementCourantToLivretA(expediteurId, montant) {
        try {

            const [compteCourant] = await db.getConnection().execute(
                "SELECT * FROM Compte WHERE utilisateur_id = ? AND type_compte = 'courant'",
                [expediteurId]
            );

            const [compteLivretA] = await db.getConnection().execute(
                "SELECT * FROM Compte WHERE utilisateur_id = ? AND type_compte = 'livretA'",
                [expediteurId]
            );

            if (compteCourant.length === 0 || compteLivretA.length === 0) {
                throw new Error("Comptes non trouvés");
            }

            if (compteCourant[0].solde < montant) {
                throw new Error("Solde insuffisant dans le compte courant");
            }

            await db.getConnection().execute(
                "UPDATE Compte SET solde = solde - ? WHERE id = ?",
                [montant, compteCourant[0].id]
            );

            await db.getConnection().execute(
                "UPDATE Compte SET solde = solde + ? WHERE id = ?",
                [montant, compteLivretA[0].id]
            );

            await db.getConnection().execute(
                "INSERT INTO transaction_livret (compte_id, montant, type) VALUES (?, ?, ?)",
                [compteLivretA[0].id, montant, 'depot']
            );

            return { message: `Virement de ${montant} € effectué du compte courant vers le Livret A` };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static async virementLivretAToCourant(expediteurId, montant) {
        try {
            const [compteCourant] = await db.getConnection().execute(
                "SELECT * FROM Compte WHERE utilisateur_id = ? AND type_compte = 'courant'",
                [expediteurId]
            );

            const [compteLivretA] = await db.getConnection().execute(
                "SELECT * FROM Compte WHERE utilisateur_id = ? AND type_compte = 'livretA'",
                [expediteurId]
            );

            if (compteCourant.length === 0 || compteLivretA.length === 0) {
                throw new Error("Comptes non trouvés");
            }

            if (compteLivretA[0].solde < montant) {
                throw new Error("Solde insuffisant dans le Livret A");
            }

            await db.getConnection().execute(
                "UPDATE Compte SET solde = solde - ? WHERE id = ?",
                [montant, compteLivretA[0].id]
            );

            await db.getConnection().execute(
                "UPDATE Compte SET solde = solde + ? WHERE id = ?",
                [montant, compteCourant[0].id]
            );

            await db.getConnection().execute(
                "INSERT INTO transaction_livret (compte_id, montant, type) VALUES (?, ?, ?)",
                [compteLivretA[0].id, montant, 'retrait']
            );

            return { message: `Virement de ${montant} € effectué du Livret A vers le compte courant` };
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = Transaction;
