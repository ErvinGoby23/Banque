import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css';

const MAX_ATTEMPTS = 5;
const BLOCK_TIME = 120;

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [attempts, setAttempts] = useState(0);
    const [isBlocked, setIsBlocked] = useState(false);
    const [timeLeft, setTimeLeft] = useState(BLOCK_TIME);
    const navigate = useNavigate();

    useEffect(() => {
        if (isBlocked) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setIsBlocked(false);
                        setAttempts(0);
                        return BLOCK_TIME;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [isBlocked]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (isBlocked) {
            setError(`Vous êtes bloqué. Réessayez dans ${timeLeft} secondes.`);
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { email, password }, { withCredentials: true });

            const { utilisateur } = response.data;
            if (utilisateur.role === 'admin') {
                localStorage.setItem("token", response.data.token);
                navigate('/admin/dashboard');
            } else {
                localStorage.setItem("token", response.data.token);
                navigate('/dashboard');
            }
            window.location.reload();
        } catch (err) {
            if (err.response) {
                if (err.response.status === 429 || attempts + 1 >= MAX_ATTEMPTS) {
                    setIsBlocked(true);
                    setTimeLeft(BLOCK_TIME);
                    setError(`Trop de tentatives. Réessayez dans ${BLOCK_TIME} secondes.`);
                } else {
                    setAttempts((prev) => prev + 1);
                    setError(`Mot de passe incorrect. Il vous reste ${MAX_ATTEMPTS - (attempts + 1)} tentative(s).`);
                }
            } else {
                setError("Erreur de connexion au serveur.");
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Connexion à NovaBank</h2>

                {error && <p className="login-error">{error}</p>}
                {isBlocked && <p className="login-warning">Réessayez dans {timeLeft} secondes.</p>}

                <form onSubmit={handleLogin} className="login-form">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="login-input"
                    />
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="login-input"
                    />
                    <button type="submit" disabled={isBlocked} className="login-button">
                        Se connecter
                    </button>
                </form>

                <p className="login-link">
                    <Link to="/forgot-password">Mot de passe oublié ?</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
