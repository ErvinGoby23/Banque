import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Navbar.css';

const Navbar = () => {
    const [utilisateur, setUtilisateur] = useState(null);
    const navigate = useNavigate();

    const fetchUser = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/auth/session', { withCredentials: true });
            setUtilisateur(response.data.session);
            console.log("Utilisateur récupéré :", response.data.session);
        } catch (error) {
            setUtilisateur(null);
            console.log(" Aucun utilisateur connecté");
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });
            localStorage.removeItem("token");
            setUtilisateur(null);
            console.log(" Déconnexion réussie");
            navigate('/');
        } catch (error) {
            console.log(" Erreur lors de la déconnexion", error);
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-content">
                <div className="navbar-left">
                    <Link to="/dashboard" className="navbar-logo">NovaBank</Link>
                </div>
                <div className="navbar-right">
                    {utilisateur ? (
                        <>
                            <Link to="/virement" className="navbar-link">Virement</Link>
                            <Link to="/crypto" className="navbar-link">Crypto</Link>
                            <Link to="/bourse" className="navbar-link">Bourse</Link>
                            <button onClick={handleLogout} className="navbar-button">Déconnexion</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="navbar-link">Connexion</Link>
                            <Link to="/register" className="navbar-link">Inscription</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
