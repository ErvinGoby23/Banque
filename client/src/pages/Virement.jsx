import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Virement.css';

const VirementPage = () => {
  const [destinataireId, setDestinataireId] = useState('');
  const [montantUtilisateur, setMontantUtilisateur] = useState('');
  const [montantInterne, setMontantInterne] = useState('');
  const [typeTransaction, setTypeTransaction] = useState('courant-to-livretA');
  const [messageUtilisateur, setMessageUtilisateur] = useState('');
  const [messageInterne, setMessageInterne] = useState('');
  const [errorUtilisateur, setErrorUtilisateur] = useState('');
  const [errorInterne, setErrorInterne] = useState('');
  const [soldeCourant, setSoldeCourant] = useState(0);
  const [soldeLivretA, setSoldeLivretA] = useState(0);
  const [loadingUtilisateur, setLoadingUtilisateur] = useState(false);
  const [loadingInterne, setLoadingInterne] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);

  useEffect(() => {
    const fetchSolde = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/compte/solde', { withCredentials: true });
        const compteCourant = response.data.find(c => c.type_compte === 'courant');
        const livretA = response.data.find(c => c.type_compte === 'livretA');
        setSoldeCourant(parseFloat(compteCourant?.solde) || 0);
        setSoldeLivretA(parseFloat(livretA?.solde) || 0);
      } catch (err) {
        setErrorInterne('Erreur récupération solde.');
      }
    };
    fetchSolde();
  }, []);

  const handleSubmitUtilisateur = (e) => {
    e.preventDefault();
    setMessageUtilisateur('');
    setErrorUtilisateur('');

    const montant = parseFloat(montantUtilisateur);
    if (!destinataireId || isNaN(montant) || montant <= 0) {
      setErrorUtilisateur("ID ou montant invalide.");
      return;
    }

    setConfirmationVisible(true);
  };

  const handleConfirmUtilisateur = async () => {
    setConfirmationVisible(false);
    setLoadingUtilisateur(true);
    setMessageUtilisateur('');
    setErrorUtilisateur('');

    try {
      const montant = parseFloat(montantUtilisateur);
      const res = await axios.post(
        'http://localhost:5000/api/transaction/virement',
        { destinataireId, montant },
        { withCredentials: true }
      );
      setMessageUtilisateur(res.data.message || " Virement réussi !");
      setDestinataireId('');
      setMontantUtilisateur('');
    } catch (err) {
      setErrorUtilisateur(err.response?.data?.error || " Erreur virement.");
    } finally {
      setLoadingUtilisateur(false);
    }
  };

  const handleCancelUtilisateur = () => {
    setConfirmationVisible(false);
  };

  const handleVirementInterne = async (e) => {
    e.preventDefault();
    setMessageInterne('');
    setErrorInterne('');
    setLoadingInterne(true);

    const montant = parseFloat(montantInterne);
    if (isNaN(montant) || montant <= 0) {
      setErrorInterne("Montant invalide.");
      setLoadingInterne(false);
      return;
    }

    if (typeTransaction === 'courant-to-livretA' && montant > soldeCourant) {
      setErrorInterne("Solde insuffisant sur le courant.");
      setLoadingInterne(false);
      return;
    }

    if (typeTransaction === 'livretA-to-courant' && montant > soldeLivretA) {
      setErrorInterne("Solde insuffisant sur le Livret A.");
      setLoadingInterne(false);
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:5000/api/transaction/virement-livretA',
        { montant, typeTransaction },
        { withCredentials: true }
      );
      setMessageInterne(res.data.message || " Virement interne réussi !");
      setMontantInterne('');
    } catch (err) {
      setErrorInterne(err.response?.data?.error || " Erreur virement interne.");
    } finally {
      setLoadingInterne(false);
    }
  };

  return (
    <div className="virement-container">
      <div className="virement-sections">
        <div className="virement-card">
          <h2 className="virement-title">Vers un utilisateur</h2>
          <form onSubmit={handleSubmitUtilisateur} className="virement-form">
            <input
              type="number"
              placeholder="ID du destinataire"
              value={destinataireId}
              onChange={(e) => setDestinataireId(e.target.value)}
              className="virement-input"
              required
            />
            <input
              type="number"
              placeholder="Montant (€)"
              value={montantUtilisateur}
              onChange={(e) => setMontantUtilisateur(e.target.value)}
              className="virement-input"
              required
            />
            <button type="submit" className="virement-button" disabled={loadingUtilisateur}>
              {loadingUtilisateur ? "Envoi en cours..." : "Envoyer"}
            </button>

            {confirmationVisible && (
              <div className="virement-confirm">
                <p>
                  Confirmez-vous le virement de <strong>{montantUtilisateur}€</strong> à l'utilisateur ID <strong>{destinataireId}</strong> ?
                </p>
                <div className="virement-confirm-buttons">
                  <button onClick={handleConfirmUtilisateur} className="virement-button">Oui</button>
                  <button onClick={handleCancelUtilisateur} className="virement-button virement-cancel">Non</button>
                </div>
              </div>
            )}

            {messageUtilisateur && <p className="virement-message success">{messageUtilisateur}</p>}
            {errorUtilisateur && <p className="virement-message error">{errorUtilisateur}</p>}
          </form>
        </div>

        
        <div className="virement-card">
          <h2 className="virement-title">Entre mes comptes</h2>
          <form onSubmit={handleVirementInterne} className="virement-form">
            <select
              value={typeTransaction}
              onChange={(e) => setTypeTransaction(e.target.value)}
              className="virement-input"
            >
              <option value="courant-to-livretA">Courant ➜ Livret A</option>
              <option value="livretA-to-courant">Livret A ➜ Courant</option>
            </select>
            <input
              type="number"
              placeholder="Montant (€)"
              value={montantInterne}
              onChange={(e) => setMontantInterne(e.target.value)}
              className="virement-input"
              required
            />
            <div className="virement-balances">
               Courant : <strong>{soldeCourant.toFixed(2)}€</strong><br />
               Livret A : <strong>{soldeLivretA.toFixed(2)}€</strong>
            </div>
            <button type="submit" className="virement-button" disabled={loadingInterne}>
              {loadingInterne ? "Transfert..." : "Transférer"}
            </button>
            {messageInterne && <p className="virement-message success">{messageInterne}</p>}
            {errorInterne && <p className="virement-message error">{errorInterne}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default VirementPage;
