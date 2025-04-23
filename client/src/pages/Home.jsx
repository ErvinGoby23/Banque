import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <div className="home-hero">
        <h1 className="home-title">Bienvenue chez NovaBank</h1>
        <p className="home-subtitle">Une nouvelle manière de gérer votre argent, en toute simplicité et sécurité.</p>
        <div className="home-buttons">
          <Link to="/login">
            <button className="home-btn">Se connecter</button>
          </Link>
          <Link to="/register">
            <button className="home-btn home-signup">S'inscrire</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
