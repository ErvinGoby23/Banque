const AuthService = require('../services/AuthService');

class AuthController {
    static async register(req, res) {
        try {
            const { nom, prenom, email, password, telephone } = req.body;
            const utilisateur = await AuthService.register(nom, prenom, email, password, telephone);
            res.json({ message: "Utilisateur inscrit avec succès", utilisateur });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const { utilisateur, token } = await AuthService.login(email, password);
            
            req.session.utilisateur = { 
                id: utilisateur.id, 
                nom: utilisateur.nom, 
                prenom: utilisateur.prenom, 
                email: utilisateur.email,
                role: utilisateur.role,
                telephone: utilisateur.telephone
            };
            
            console.log(`Connexion réussie : ${utilisateur.nom} ${utilisateur.prenom} (ID: ${utilisateur.id})`);
            console.log(`Session actuelle :`, req.session.utilisateur);
            
            res.json({ message: "Connexion réussie", token, utilisateur });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async verifyEmail(req, res) {
        try {
            const { token } = req.params;
            const message = await AuthService.verifyEmail(token);
            res.json({ message });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            const response = await AuthService.forgotPassword(email);
            res.json(response);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async resetPassword(req, res) {
        try {
            const { resetToken, newPassword } = req.body;
            const response = await AuthService.resetPassword(resetToken, newPassword);
            res.json(response);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }z
}

module.exports = AuthController;
