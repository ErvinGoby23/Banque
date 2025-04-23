const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const MailService = require('../services/mailService');
require('dotenv').config();

class AuthService {
    static async register(nom, prenom, email, password, telephone) {
        const existingUser = await User.findByEmail(email);
        if (existingUser) throw new Error("Email déjà utilisé");

        const verificationToken = uuidv4();
        console.log(`🔹 Token généré pour ${email} : ${verificationToken}`);

        const utilisateur = await User.create(nom, prenom, email, password, telephone, verificationToken);

        await MailService.sendVerificationEmail(email, verificationToken);

        return utilisateur;
    }

    static async verifyEmail(token) {
        const success = await User.verifyEmail(token);
        if (!success) throw new Error("Lien de vérification invalide ou expiré");
        return { message: "Email vérifié avec succès" };
    }

    static async login(email, password) {
        const utilisateur = await User.findByEmail(email);
        if (!utilisateur) throw new Error("Utilisateur non trouvé");
        if (!utilisateur.verified) throw new Error("Veuillez vérifier votre e-mail avant de vous connecter");

        const isMatch = await bcrypt.compare(password, utilisateur.password);
        if (!isMatch) throw new Error("Mot de passe incorrect");

        const token = jwt.sign({ id: utilisateur.id, role: utilisateur.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        return { utilisateur, token };
    }

    static async forgotPassword(email) {
        const utilisateur = await User.findByEmail(email);
        if (!utilisateur) throw new Error("Utilisateur non trouvé");

        const resetToken = uuidv4();
        await User.setResetToken(email, resetToken);
        await MailService.sendResetPasswordEmail(email, resetToken);

        return { message: "Email de réinitialisation envoyé" };
    }
    
    static async resetPassword(resetToken, newPassword) {
        const utilisateur = await User.findByResetToken(resetToken);
        if (!utilisateur) throw new Error("Lien de réinitialisation invalide ou expiré");

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.updatePassword(utilisateur.email, hashedPassword);
        await User.clearResetToken(utilisateur.email);

        return { message: "Mot de passe réinitialisé avec succès" };
    }
}

module.exports = AuthService;
