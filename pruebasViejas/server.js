//documentacion node tiene todo, server tiene head que dice el tipo de dato y el body de la request, tiene que escuchar y esperar peticiones de un puerto especifico
// poner en navegador http://localhost:8000/ (que sea http sin s porque sino chrome busca algo incorrecto) 

import http from 'node:http';
import {readFile} from 'node:fs/promises'// para abrir otros archivos como el html
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Función para leer archivos
async function leerarchivo(filePath) {
  const ruta = path.join(__dirname, 'static', filePath);//dirname tiene la ruta hasta la carpeta de backend
  console.log('Ruta completa que intenta abrir:', ruta);
  const pagina = await readFile(ruta, {encoding: 'utf8'});
  return pagina;
}
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);//obtiene la ruta a ala carpeta donde esta server

// Create a local server to receive data from
const server = http.createServer ( async (req, res) => {
  if (req.method !== 'GET') {
    //error 405
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Método no permitido.');
    return;
  }
  const filePath = req.url === '/' ? 'test1html.html': req.url;
  try{ 
    const mostrar=await leerarchivo(filePath)// recordar await para cosas asyncronicas como la funcion
    res.writeHead(200, { 'Content-Type': 'text/html' });//puede ser texto  application\json , vamos a ahi mandar el html
    res.end(mostrar);
  }catch(error){
    console.error('Error al leer el archivo:', error.message);
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Página no encontrada');
  }
  
});

// Escuchar una sola vez
server.listen(8000, () => {
  console.log('Servidor corriendo en http://localhost:8000');
})
server.on('error', (err) => {
  console.error('Error al iniciar el servidor:', err.message);
});




  
