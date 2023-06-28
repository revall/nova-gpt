import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';

const SOCKET_ENDPOINT = 'http://localhost:3001'
@Injectable({
  providedIn: 'root'
})
export class SocketsService {
  socket!: any
  // Socket<DefaultEventsMap, >;

  setupSocketConnection() {
    this.socket = io(SOCKET_ENDPOINT);

    this.socket.emit('events', { test: 'test' });

    this.socket.on('events', (data: string) => {
      console.log('event:', data);
    });
    this.socket.on('message', (data: string) => {
      console.log('message:', data);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  send(message: string) {
    this.socket.emit('message', message);
  }

}
