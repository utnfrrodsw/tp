import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';

const PORT = 3000;
const STATIC_DIR = path.resolve('./static');
const LOG_FILE = path.resolve('./server.log');

// Función para escribir en el log
async function logRequest({ method, url, code, message }) {
  const timestamp = new Date().toISOString();
  const line = `${method} ${url} [${timestamp}] → ${code} ${message}\n`;
  try {
    await fs.appendFile(LOG_FILE, line);
  } catch (err) {
    console.error('No se pudo escribir en el log:', err.message);
  }
}

// Mapear URL a archivo en /static
function mapUrlToFile(url) {
  let pathname = url;
  // alias para la raíz o /home o /index
  if (url === '/' || url === '/home' || url === '/index') {
    pathname = '/index.html';
  }
  // si pide /home.html ya está bien
  return path.join(STATIC_DIR, pathname);
}

// Detección simple de mime-types
const MIME_TYPES = {
  html: 'text/html',
  css: 'text/css',
  js: 'application/javascript',
  txt: 'text/plain',
};

const server = http.createServer(async (req, res) => {
  let code, message;

  try {
    // 1) Sólo GET
    if (req.method !== 'GET') {
      code = 405;
      message = 'Method Not Allowed';
      res.writeHead(code, { 'Content-Type': 'text/plain' });
      return res.end(message);
    }

    // 2) Mapear URL y leer archivo
    const filePath = mapUrlToFile(req.url);
    // Evitar que suban fuera de /static
    if (!filePath.startsWith(STATIC_DIR)) {
      throw { code: 404 };
    }

    const data = await fs.readFile(filePath, 'utf-8');
    code = 200;
    message = 'OK';

    // Detectar extensión y content-type
    const ext = path.extname(filePath).slice(1);
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(code, { 'Content-Type': contentType });
    res.end(data);
  } catch (err) {
    // 404 si no existe
    if (err.code === 'ENOENT' || err.code === 404) {
      code = 404;
      message = 'Not Found';
      res.writeHead(code, { 'Content-Type': 'text/plain' });
      res.end(message);
    } else {
      // 500 para otros errores
      code = 500;
      message = 'Internal Server Error';
      res.writeHead(code, { 'Content-Type': 'text/plain' });
      res.end(message);
      console.error('Error interno:', err);
    }
  } finally {
    // 3) Loguear siempre
    await logRequest({
      method: req.method,
      url: req.url,
      code,
      message,
    });
  }
});

// 4) Arrancar servidor
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
