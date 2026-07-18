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

async function enviarMailVerificador(direccionEmail: string, tokenVerificacion: string) {
    try {
        await transporter.sendMail({
        from: `"Gestión Taller" <${process.env.EMAIL_USER}>`,
        to: direccionEmail,
        subject: "Verificación de cuenta",
        html: crearMailVerificacion(tokenVerificacion)
        });
        console.log("Mail enviado con éxito");
    } catch (error) {
        console.error("Error enviando mail:", error);
    }
}

function crearMailVerificacion(tokenVerificacion: string) {
    const dataToken= parseJwt(tokenVerificacion);
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
            <tr>
                <td bgcolor="#2563eb" style="padding: 40px 0 40px 0; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">Gestión Taller Mecanico</h1>
                </td>
            </tr>

            <tr>
                <td style="padding: 40px 30px 40px 30px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                            <td style="color: #1e293b; font-size: 20px; font-weight: bold;">
                                Validando Cuenta - ${username}
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 20px 0 30px 0; color: #475569; font-size: 16px; line-height: 24px;">
                                Hola, <strong>${username}</strong>.<br><br>
                                Te informamos que el estado de tu cuenta/solicitud es registrado, para habilitarlo e ingresar al sistema presione el botón de abajo.
                            </td>
                        </tr>
                        <tr>
                            <td align="center">
                                <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate;">
                                    <tr>
                                        <td align="center" bgcolor="#2563eb" style="border-radius: 6px;">
                                            <a href="http://localhost:3000/auth/validateCuenta/${tokenVerificacion}" target="_blank" style="display: inline-block; padding: 14px 28px; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px;">Valida cuenta</a>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 30px 0 0 0; color: #64748b; font-size: 14px; line-height: 20px; border-top: 1px solid #e2e8f0;">
                                Si no esperabas este correo, por favor desestímalo o contacta con soporte técnico.
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <tr>
                <td bgcolor="#f8fafc" style="padding: 20px 30px 20px 30px; text-align: center; color: #94a3b8; font-size: 12px;">
                    &copy; 2026 TechFix - Sistema de Gestión Técnica.<br>
                    Rosario, Santa Fe, Argentina.
                </td>
            </tr>
        </table>
    </body>
    </html>
    ` 
}




export default  enviarMailVerificador;