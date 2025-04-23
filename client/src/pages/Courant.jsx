import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Courant.css';

const Courant = () => {
  const [user, setUser] = useState(null);
  const [compte, setCompte] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [livretTransactions, setLivretTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionRes = await axios.get('http://localhost:5000/api/auth/session', { withCredentials: true });
        setUser(sessionRes.data.session);

        const compteRes = await axios.get('http://localhost:5000/api/compte/solde', { withCredentials: true });
        const courant = compteRes.data.find(c => c.type_compte === 'courant');
        setCompte(courant);

        const transactionRes = await axios.get('http://localhost:5000/api/transaction/historique', { withCredentials: true });
        setTransactions(transactionRes.data);

        const livretRes = await axios.get('http://localhost:5000/api/livretA/transactions', { withCredentials: true });
        setLivretTransactions(livretRes.data);
      } catch (err) {
        console.error("Erreur chargement compte courant :", err.message);
      }
    };

    fetchData();
  }, []);

  if (!compte || !user) return <p className="courant-container">Chargement...</p>;

  const allTransactions = [
    ...transactions.map(tx => ({ ...tx, type_compte: 'courant' })),
    ...livretTransactions.map(tx => ({ ...tx, type_compte: 'livretA' }))
  ];

  const sortedTransactions = allTransactions.sort(
    (a, b) => new Date(b.date_transaction) - new Date(a.date_transaction)
  );

  return (
    <div className="courant-wrapper">
      <div className="courant-container">
        <div className="courant-solde">
          <h1>{Number(compte.solde).toLocaleString()} €</h1>
          <p>
            Compte N° {compte.numero_compte} – {compte.type_compte.charAt(0).toUpperCase() + compte.type_compte.slice(1)}
          </p>
        </div>

        <h2 className="courant-title">Historique des Transactions</h2>
        <div className="courant-cards">
          {sortedTransactions.map((tx, i) => {
            const isDebit = tx.expediteur_id === user.id;
            const isLivretA = tx.type_compte === 'livretA';
            const isRetraitLivretA = isLivretA && tx.type === 'retrait';
            const isVirementSortant = !isLivretA && isDebit;
            const sign = isRetraitLivretA ? '+' : (isLivretA && !isRetraitLivretA ? '−' : (isVirementSortant ? '−' : '+'));

            return (
              <div className="courant-card" key={i}>
                <div className="courant-info">
                  <p className="courant-label">
                    {isLivretA
                      ? (isRetraitLivretA ? 'Retrait du Livret A' : 'Dépôt sur Livret A')
                      : (isDebit ? 'Virement envoyé' : 'Virement reçu')}
                  </p>
                  {!isLivretA && (
                    <p className="courant-sub">
                      {isDebit
                        ? `À : ${tx.destinataire_prenom} ${tx.destinataire_nom}`
                        : `De : ${tx.expediteur_prenom} ${tx.expediteur_nom}`}
                    </p>
                  )}
                  <p
                    className="courant-amount"
                    style={{
                      color: isRetraitLivretA ? '#4caf50' : (isLivretA && !isRetraitLivretA ? '#ff5c5c' : (isVirementSortant ? '#ff5c5c' : '#4caf50')),
                    }}
                  >
                    {sign}{Number(tx.montant).toFixed(2)} €
                  </p>
                  <p className="courant-sub">Date : {new Date(tx.date_transaction).toLocaleDateString()}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Courant;
