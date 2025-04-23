import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/LivretA.css';

const LivretA = () => {
  const [user, setUser] = useState(null);
  const [livretA, setLivretA] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const taux = 0.0075;
  const plafond = 22950;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionRes = await axios.get('http://localhost:5000/api/auth/session', { withCredentials: true });
        setUser(sessionRes.data.session);

        const compteRes = await axios.get('http://localhost:5000/api/compte/solde', { withCredentials: true });
        const compte = compteRes.data.find(c => c.type_compte === 'livretA');
        setLivretA(compte);

        if (compte) {
          const transactionsRes = await axios.get('http://localhost:5000/api/livretA/transactions', { withCredentials: true });
          setTransactions(transactionsRes.data);
        }
      } catch (error) {
        console.error('Erreur chargement Livret A :', error.message);
      }
    };

    fetchData();
  }, []);

  if (!user || !livretA) {
    return (
      <div className="livret-page">
        <p className="livret-loading">Chargement...</p>
      </div>
    );
  }

  const interets = livretA.solde * taux;

  return (
    <div className="livret-page">
      <div className="livret-card">
        <h1 className="livret-title"> {Number(livretA.solde).toLocaleString()} €</h1>
        <p className="livret-account">Compte Livret A – {livretA.numero_compte}</p>

        <div className="livret-info">
          <p><strong>Taux d'intérêt :</strong> {(taux * 100).toFixed(2)}%</p>
          <p><strong>Plafond :</strong> {plafond.toLocaleString()} €</p>
          <p><strong>Intérêts estimés :</strong> {interets.toFixed(2)} €</p>
        </div>

        <h3 className="livret-subtitle">Historique des transactions</h3>
        <ul className="livret-transactions">
          {transactions.map((tx, i) => (
            <li key={i} className="livret-transaction">
              <strong>Date :</strong> {new Date(tx.date_transaction).toLocaleDateString()}<br />
              <strong>Montant :</strong> {tx.type === 'depot' ? '+' : '-'}{Number(tx.montant).toFixed(2)} € ({tx.type})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LivretA;
