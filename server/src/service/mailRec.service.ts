import nodemailer from 'nodemailer';
import parseJwt from '../utils/toke.utils.js';


const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

async function enviarMailResetPassword(direccionEmail: string, resetToken: string) {
    try {
        await transporter.sendMail({
        from: `"Gestión Taller" <${process.env.EMAIL_USER}>`,
        to: direccionEmail,
        subject: "Recuperación de contraseña",
        html: crearMailResetPassword(resetToken)
        });
        console.log("Mail enviado con éxito");
    } catch (error) {
        console.error("Error enviando mail:", error);
    }
}

function crearMailResetPassword(resetToken: string) {
    const dataToken= parseJwt(resetToken);
    const username = dataToken ? dataToken.username : "Usuario";
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f9;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; background-color: #ffffff; margin-top: 30px; margin-bottom: 30px; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
            
            <!-- Header -->
            <tr>
                <td bgcolor="#1565C0" style="padding: 40px 0; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0 0 6px 0; font-size: 24px; letter-spacing: 1px;">TechFix</h1>
                    <p style="color: #BBDEFB; margin: 0; font-size: 13px;">Sistema de Gestión Técnica</p>
                </td>
            </tr>

            <!-- Ícono -->
            <tr>
                <td style="text-align: center; padding: 36px 30px 0 30px;">
                    <div style="display: inline-block; background-color: #EFF6FF; border-radius: 50%; width: 64px; height: 64px; line-height: 64px; font-size: 28px;">
                        🔐
                    </div>
                </td>
            </tr>

            <!-- Cuerpo -->
            <tr>
                <td style="padding: 24px 40px 36px 40px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                            <td style="color: #1e293b; font-size: 20px; font-weight: bold; text-align: center; padding-bottom: 16px;">
                                Solicitud de cambio de contraseña
                            </td>
                        </tr>
                        <tr>
                            <td style="color: #475569; font-size: 15px; line-height: 24px; text-align: center; padding-bottom: 32px;">
                                Hola, <strong>${username}</strong>.<br><br>
                                Recibimos una solicitud para restablecer la contraseña de tu cuenta.<br>
                                Si fuiste vos, hacé clic en el botón de abajo. Si no fuiste vos, podés ignorar este mensaje.
                            </td>
                        </tr>

                        <!-- Botón -->
                        <tr>
                            <td align="center" style="padding-bottom: 28px;">
                                <table border="0" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td align="center" style="border-radius: 999px; background: linear-gradient(135deg, #1565C0 0%, #0D47A1 100%); box-shadow: 0 8px 24px rgba(21,101,192,0.35);">
                                            <a href="http://${process.env.FRONTEND_HOST}:${process.env.FRONTEND_PORT}/reset-password/${resetToken}"
                                            target="_blank"
                                            style="display: inline-block; padding: 14px 36px; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 15px; letter-spacing: 0.3px; border-radius: 999px;">
                                                Restablecer contraseña
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- Aviso expiración -->
                        <tr>
                            <td style="text-align: center;">
                                <p style="color: #94a3b8; font-size: 13px; margin: 0;">
                                    ⏱ Este enlace expira en <strong>1 hora</strong>.
                                </p>
                            </td>
                        </tr>

                        <!-- Línea separadora -->
                        <tr>
                            <td style="padding: 28px 0 0 0;">
                                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 0;">
                            </td>
                        </tr>

                        <!-- Link alternativo -->
                        <tr>
                            <td style="padding-top: 20px; color: #94a3b8; font-size: 12px; text-align: center; line-height: 20px;">
                                Si el botón no funciona, copiá y pegá este enlace en tu navegador:<br>
                                <span style="color: #2563eb; word-break: break-all;">
                                    http://${process.env.FRONTEND_HOST}:${process.env.FRONTEND_PORT}/reset-password/${resetToken}
                                </span>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <!-- Footer -->
            <tr>
                <td bgcolor="#f8fafc" style="padding: 20px 30px; text-align: center; color: #94a3b8; font-size: 12px; line-height: 20px;">
                    &copy; 2026 TechFix - Sistema de Gestión Técnica.<br>
                    Rosario, Santa Fe, Argentina.
                </td>
            </tr>

        </table>
    </body>
    </html>
    `
}

export default enviarMailResetPassword;