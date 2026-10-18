import { Server } from 'socket.io';
import type { Server as HttpServer } from 'http';

let io: Server;

export function initWebSocket(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: { origin: process.env.FRONTEND_URL ?? 'http://localhost:5173' },
  });

  io.on('connection', (socket) => {
    console.log(`[WS] Cliente conectado: ${socket.id}`);
    socket.on('disconnect', () => console.log(`[WS] Cliente desconectado: ${socket.id}`));
  });

  return io;
}

// Usá esto desde tus controllers/services cuando algo cambie en Gestión
export function emitEvent(type: string, payload?: unknown): void {
  io.emit(type, payload); // broadcast a todos
}