import { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';

import '../styles/Crypto.css';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const Crypto = () => {
  const [prices, setPrices] = useState({});
  const [crypto, setCrypto] = useState('BTC');
  const [montantEUR, setMontantEUR] = useState('');
  const [quantite, setQuantite] = useState('');
  const [message, setMessage] = useState('');
  const [toastType, setToastType] = useState('');
  const [loading, setLoading] = useState(false);
  const [wallet, setWallet] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
        setToastType('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchAllData = async () => {
    try {
      const [priceRes, walletRes] = await Promise.all([
        axios.get('http://localhost:5000/api/crypto/cours'),
        axios.get('http://localhost:5000/api/crypto/portefeuille', { withCredentials: true })
      ]);

      setPrices({
        BTC: priceRes.data.bitcoin.eur,
        ETH: priceRes.data.ethereum.eur,
        SOL: priceRes.data.solana.eur
      });

      setWallet(walletRes.data);
    } catch (error) {
      setMessage("Erreur lors du chargement des données.");
      setToastType('error');
    }
  };

  const handleAchat = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/crypto/acheter',
        { crypto, montantEUR: parseFloat(montantEUR) },
        { withCredentials: true }
      );
      setMessage(response.data.message);
      setToastType('success');
      setMontantEUR('');
      fetchAllData();
    } catch (error) {
      setMessage(error.response?.data?.error || "Erreur lors de l'achat");
      setToastType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleVente = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/crypto/vendre',
        { crypto, quantite: parseFloat(quantite) },
        { withCredentials: true }
      );
      setMessage(response.data.message);
      setToastType('success');
      setQuantite('');
      fetchAllData();
    } catch (error) {
      setMessage(error.response?.data?.error || "Erreur lors de la vente");
      setToastType('error');
    } finally {
      setLoading(false);
    }
  };

  const simulateHistory = (base) => {
    return Array.from({ length: 7 }, () =>
      (base * (1 + (Math.random() - 0.5) * 0.05)).toFixed(2)
    );
  };

  return (
    <div className="crypto-page">
      <div className="crypto-container">
        {message && (
          <div className={`crypto-toast ${toastType}`}>
            {message}
          </div>
        )}

        <h2 className="crypto-title">Tableau de bord Crypto</h2>

        <div className="crypto-section">
          <Line
            data={{
              labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
              datasets: [
                {
                  label: 'BTC',
                  data: simulateHistory(prices.BTC || 27000),
                  borderColor: 'gold',
                  backgroundColor: 'rgba(255, 215, 0, 0.1)',
                  tension: 0.4,
                },
                {
                  label: 'ETH',
                  data: simulateHistory(prices.ETH || 1700),
                  borderColor: 'violet',
                  backgroundColor: 'rgba(238,130,238,0.1)',
                  tension: 0.4,
                },
                {
                  label: 'SOL',
                  data: simulateHistory(prices.SOL || 25),
                  borderColor: 'limegreen',
                  backgroundColor: 'rgba(50,205,50,0.1)',
                  tension: 0.4,
                }
              ]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  labels: { color: 'white', font: { size: 14 } }
                }
              },
              scales: {
                x: { ticks: { color: 'white' } },
                y: { ticks: { color: 'white' } }
              }
            }}
          />
        </div>

        <div className="crypto-section">
          <h3>Cours en temps réel (€)</h3>
          {prices.BTC ? (
            <>
              <p>🟡 <strong>BTC</strong> : {prices.BTC} €</p>
              <p>🟣 <strong>ETH</strong> : {prices.ETH} €</p>
              <p>🟢 <strong>SOL</strong> : {prices.SOL} €</p>
            </>
          ) : (
            <p>Chargement...</p>
          )}
        </div>

        <div className="crypto-form-row">
          <div className="crypto-section crypto-form-column">
            <h3>Acheter</h3>
            <form onSubmit={handleAchat}>
              <select className="crypto-select" value={crypto} onChange={(e) => setCrypto(e.target.value)}>
                <option value="BTC">Bitcoin</option>
                <option value="ETH">Ethereum</option>
                <option value="SOL">Solana</option>
              </select>
              <input
                type="number"
                placeholder="Montant (€)"
                value={montantEUR}
                onChange={(e) => setMontantEUR(e.target.value)}
                required
                step="0.01"
                className="crypto-input"
              />
              <button type="submit" className="crypto-button" disabled={loading}>
                {loading ? "Achat..." : "Acheter"}
              </button>
            </form>
          </div>

          <div className="crypto-section crypto-form-column">
            <h3>Vendre</h3>
            <form onSubmit={handleVente}>
              <select className="crypto-select" value={crypto} onChange={(e) => setCrypto(e.target.value)}>
                <option value="BTC">Bitcoin</option>
                <option value="ETH">Ethereum</option>
                <option value="SOL">Solana</option>
              </select>
              <input
                type="number"
                placeholder="Quantité"
                value={quantite}
                onChange={(e) => setQuantite(e.target.value)}
                required
                step="0.00000001"
                className="crypto-input"
              />
              <button type="submit" className="crypto-button" disabled={loading}>
                {loading ? "Vente..." : "Vendre"}
              </button>
            </form>
          </div>
        </div>

        <div className="crypto-section">
          <h3>Mon portefeuille</h3>
          {wallet.length === 0 ? (
            <p>Vous ne possédez aucune cryptomonnaie.</p>
          ) : (
            wallet.map((item, index) => {
              const cours = prices[item.crypto] || 0;
              const valeur = (parseFloat(item.quantite) * cours).toFixed(2);
              return (
                <div key={index}>
                  <strong>{item.crypto}</strong> : {parseFloat(item.quantite).toFixed(8)} → <span style={{ color: "lightgreen" }}>{valeur} €</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Crypto;
