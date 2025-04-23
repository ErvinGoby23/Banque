import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/ResetPassword.css';

const ResetPassword = () => {
    const { token: resetToken } = useParams();
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (newPassword !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/auth/reset-password', {
                resetToken,
                newPassword,
            });
            setMessage(response.data.message);
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            setMessage(error.response?.data?.error || "Erreur lors de la réinitialisation.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-container">
            <div className="reset-card">
                <h2 className="reset-title">Réinitialiser le mot de passe</h2>
                <form onSubmit={handleResetPassword}>
                    <input
                        type="password"
                        placeholder="Nouveau mot de passe"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        disabled={loading}
                        className="reset-input"
                    />
                    <input
                        type="password"
                        placeholder="Confirmez le mot de passe"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={loading}
                        className="reset-input"
                    />
                    <button type="submit" disabled={loading} className="reset-button">
                        {loading ? "Envoi..." : "Réinitialiser"}
                    </button>
                </form>
                {error && <p className="reset-error">{error}</p>}
                {message && <p className="reset-message">{message}</p>}
            </div>
        </div>
    );
};

export default ResetPassword;
