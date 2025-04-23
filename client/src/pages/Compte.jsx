import React, { useState } from 'react';
import axios from 'axios';

const Compte = () => {
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleDeleteAccount = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/delete-account');
            setSuccess(response.data.message);
        } catch (err) {
            setError(err.response?.data?.error || 'Une erreur est survenue.');
        }
    };

    return (
        <div className="compte-container">
            <h2>Mon Compte</h2>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            <button onClick={handleDeleteAccount} className="delete-account-button">
                Supprimer mon compte
            </button>
        </div>
    );
};

export default Compte;
