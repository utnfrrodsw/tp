// src/shared/jwt.config.ts
const jwtConfig = {
  secret: process.env.JWT_SECRET || 'secretkey',  // mejor usar .env
  expiresIn: '5h',  // duración del token
};

export default jwtConfig;
