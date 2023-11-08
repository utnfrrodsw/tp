// email.js

const nodemailer = require('nodemailer');

const sendPasswordResetEmail = (email, resetCode) => {
  // Configuración de transporte para enviar correos electrónicos
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // Reemplaza con el servicio de correo que estés utilizando
    auth: {
      user: 'equipofastservices@gmail.com', // Tu dirección de correo electrónico
      pass: 'ynnq fewc bxci xire', // Tu contraseña de correo electrónico
    },
  });

  // Opciones del correo electrónico
  const mailOptions = {
    from: 'Fast Service Company', // Tu dirección de correo electrónico
    to: email, // La dirección de correo electrónico del destinatario
    subject: 'Recuperación de contraseña', // Asunto del correo
    text: `Tu código de recuperación es: ${resetCode} `, // Cuerpo del correo con el código de recuperación
  };

  // Enviar el correo electrónico
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error al enviar el correo electrónico:', error);
    } else {
      console.log('Correo electrónico enviado:', info.response);
    }
  });
};

module.exports = { sendPasswordResetEmail };
