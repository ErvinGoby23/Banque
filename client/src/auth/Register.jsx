import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Register.css';

const Register = () => {
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [telephone, setTelephone] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/auth/register', {
                nom,
                prenom,
                email,
                password,
                telephone,
                role: 'client'
            });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || "Erreur lors de l'inscription");
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h2 className="register-title">Inscription</h2>
                {error && <p className="register-error">{error}</p>}
                <form onSubmit={handleRegister} className="register-form">
                    <input
                        type="text"
                        placeholder="Nom"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        required
                        className="register-input"
                    />
                    <input
                        type="text"
                        placeholder="Prénom"
                        value={prenom}
                        onChange={(e) => setPrenom(e.target.value)}
                        required
                        className="register-input"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="register-input"
                    />
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="register-input"
                    />
                    <input
                        type="password"
                        placeholder="Confirmer le mot de passe"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="register-input"
                    />
                    <input
                        type="text"
                        placeholder="Téléphone (optionnel)"
                        value={telephone}
                        onChange={(e) => setTelephone(e.target.value)}
                        className="register-input"
                    />
                    <button type="submit" className="register-button">
                        S'inscrire
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
