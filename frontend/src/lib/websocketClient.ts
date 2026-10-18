import { io, Socket } from 'socket.io-client';
import { eventBus, EVENTS } from './eventBus';
import { VITE_WS_URL } from './config';


class WebSocketClient {
  private socket: Socket | null = null;

  connect(): void {
    this.socket = io(VITE_WS_URL, { transports: ['websocket'] });

    this.socket.on('connect', () => console.log('[WS] Conectado'));

    // suscribite a cada evento que ya tenés definido en EVENTS
    Object.values(EVENTS).forEach((eventName) => {
      this.socket!.on(eventName, (payload) => eventBus.emit(eventName, payload));
    });

    this.socket.on('disconnect', () => console.log('[WS] Desconectado'));
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }
}

export const websocketClient = new WebSocketClient();