const nodemailer = require('nodemailer');

class MailService {
    static async sendVerificationEmail(email, verificationToken) {
        const transporter = nodemailer.createTransport({
            service: 'gmail', 
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Vérifiez votre adresse e-mail',
            html: `
                <h2>Bienvenue sur notre site</h2>
                <p>Merci de vous être inscrit. Veuillez cliquer sur le lien ci-dessous pour vérifier votre e-mail :</p>
                <a href="http://localhost:5000/api/auth/verify-email/${verificationToken}">Vérifier mon e-mail</a>
            `
        };

        await transporter.sendMail(mailOptions);
    }

    static async sendResetPasswordEmail(email, resetToken) {
        const transporter = nodemailer.createTransport({
            service: 'gmail', 
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Réinitialisation de votre mot de passe',
            html: `
                <h2>Demande de réinitialisation de mot de passe</h2>
                <p>Vous avez demandé à réinitialiser votre mot de passe. Veuillez cliquer sur le lien ci-dessous :</p>
                <a href="http://localhost:3000/reset-password/${resetToken}">Réinitialiser mon mot de passe</a>
                <p>Si vous n'avez pas demandé cette action, ignorez cet e-mail.</p>
            `
        };

        await transporter.sendMail(mailOptions);
    }
}

module.exports = MailService;
