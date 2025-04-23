import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [comptes, setComptes] = useState([]);
  const [cryptos, setCryptos] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionRes = await axios.get('http://localhost:5000/api/auth/session', { withCredentials: true });
        if (!sessionRes.data.session) {
          navigate('/login');
          return;
        }
        setUser(sessionRes.data.session);

        const compteRes = await axios.get('http://localhost:5000/api/compte/solde', { withCredentials: true });
        setComptes(compteRes.data);

        const cryptoRes = await axios.get('http://localhost:5000/api/crypto/portefeuille', { withCredentials: true });
        setCryptos(cryptoRes.data);

        const transactionRes = await axios.get('http://localhost:5000/api/transaction/historique', { withCredentials: true });
        setTransactions(transactionRes.data);

        setLoading(false);
      } catch (error) {
        console.error('Erreur dashboard:', error.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p className="dashboard-center-text">Chargement...</p>;
  if (!user) return <p className="dashboard-center-text">Non autorisé. Veuillez vous connecter.</p>;

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [{ breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1 } }]
  };

  const renderCarouselOrList = (items) => {
    const isMobile = window.innerWidth <= 768;
    const shouldUseCarousel = items.length > 3 && !isMobile;

    if (shouldUseCarousel) {
      return (
        <Slider {...settings}>
          {items.map((item, i) => <div key={i}>{item}</div>)}
        </Slider>
      );
    }

    return <div className="dashboard-cards">{items}</div>;
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <div className="dashboard-profile">
          <img className="dashboard-avatar" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXO9uLb23RGSpPkPnTEQMMahnXA3arMxvzEQ&s" alt="Profil" />
          <div className="dashboard-infos">
            <h1>Bienvenue <span className="dashboard-highlight">{user.prenom} {user.nom}</span></h1>
            <p className="dashboard-email">{user.email}</p>
            <p className="dashboard-tel">{user.telephone}</p>
            <p className="dashboard-status"><span className="dashboard-verified">✔ Vérifié</span></p>
          </div>
        </div>

        <h2>Vos Comptes</h2>
        {renderCarouselOrList(comptes.map((compte, i) => {
          const isClickable = ['courant', 'livretA'].includes(compte.type_compte);
          const type = compte.type_compte.charAt(0).toUpperCase() + compte.type_compte.slice(1);

          const handleClick = () => {
            if (compte.type_compte === 'courant') navigate('/courant');
            if (compte.type_compte === 'livretA') navigate('/livretA');
          };

          return (
            <div
              key={i}
              className="dashboard-card"
              style={{ cursor: isClickable ? 'pointer' : 'default' }}
              onClick={handleClick}
            >
              <p><strong>{type}</strong></p>
              <p>Numéro : {compte.numero_compte}</p>
              <p>Solde : {Number(compte.solde).toLocaleString()} €</p>
            </div>
          );
        }))}

        <h2>Portefeuille Crypto</h2>
        {renderCarouselOrList(cryptos.map((crypto, i) => {
          const imageMap = {
            btc: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Bitcoin.svg',
            eth: 'https://cdn-icons-png.flaticon.com/512/1777/1777889.png',
            sol: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDiJsmxVkOJdfs5Pz9kLbmXmKxOr7jEDwFZQ&s',
          };
          const imageSrc = imageMap[crypto.crypto.toLowerCase()];

          return (
            <div key={i} className="dashboard-crypto-card">
              <img src={imageSrc} alt={crypto.crypto} className="dashboard-crypto-icon" />
              <div className="dashboard-crypto-info">
                <p className="dashboard-crypto-title">{crypto.crypto}</p>
                <p className="dashboard-crypto-sub">Quantité</p>
                <p className="dashboard-crypto-amount">{Number(crypto.quantite).toFixed(6)}</p>
              </div>
            </div>
          );
        }))}

        <h2>Dernières Transactions</h2>
        {renderCarouselOrList(transactions.map((tx, i) => (
          <div key={i} className="dashboard-card">
            <p><strong>De :</strong> {tx.expediteur_id === user.id ? "Moi" : `${tx.expediteur_prenom} ${tx.expediteur_nom} (${tx.expediteur_email})`}</p>
            <p><strong>À :</strong> {tx.destinataire_id === user.id ? "Moi" : `${tx.destinataire_prenom} ${tx.destinataire_nom} (${tx.destinataire_email})`}</p>
            <p><strong>Montant :</strong> {Number(tx.montant).toFixed(2)} €</p>
            <p><strong>Date :</strong> {new Date(tx.date_transaction).toLocaleDateString()}</p>
          </div>
        )))}
      </div>
    </div>
  );
};

export default Dashboard;
