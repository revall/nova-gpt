import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { io } from 'socket.io-client';

const SOCKET_ENDPOINT = 'http://localhost:3001'
@Injectable({
  providedIn: 'root'
})
export class SocketsService {
  socket!: any
  // Socket<DefaultEventsMap, >;
  private messageSubject = new Subject<string>()
  incomingMessage$ = this.messageSubject.asObservable()

  setupSocketConnection() {
    this.socket = io(SOCKET_ENDPOINT);

    this.socket.emit('events', { test: 'test' });

    this.socket.on('events', (data: string) => {
      console.log('event:', data);
    });
    this.socket.on('message', (data: string) => {
      console.log('message:', data);
      this.messageSubject.next(data)
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
