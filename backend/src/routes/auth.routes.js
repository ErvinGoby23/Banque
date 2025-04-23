const express = require('express');
const AuthController = require('../controllers/AuthController');

class AuthRoutes {
    constructor() {
        this.router = express.Router();
        this.initRoutes();
    }

    initRoutes() {
        this.router.post('/logout', (req, res) => {
            console.log("Déconnexion demandée pour :", req.session.utilisateur); 

            req.session.destroy((err) => {
                if (err) {
                    console.log("Erreur lors de la déconnexion :", err);
                    return res.status(500).json({ error: "Erreur lors de la déconnexion" });
                }
                res.clearCookie('connect.sid'); 
                console.log("Déconnexion réussie, session supprimée");
                res.json({ message: "Déconnexion réussie" });
            });
        });

        this.router.get('/verify-email/:token', AuthController.verifyEmail);
        this.router.post('/register', AuthController.register);
        this.router.post('/login', AuthController.login);
        this.router.get('/session', (req, res) => {
            console.log("Utilisateur actif :", req.session.utilisateur);
            if (req.session.utilisateur) {
                res.json({ session: req.session.utilisateur });
            } else {
                console.log("Aucune session active");
                res.status(401).json({ message: "Aucune session active" });
            }
        });

        this.router.post('/forgot-password', AuthController.forgotPassword);
        this.router.post('/reset-password', AuthController.resetPassword);
    }

    getRouter() {
        return this.router;
    }
}

module.exports = new AuthRoutes().getRouter();
