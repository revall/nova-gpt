import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SocketsService } from '../../services/sockets.service';

@Component({
  selector: 'nova-gpt-chat-container',
  templateUrl: './chat-container.component.html',
  styleUrls: ['./chat-container.component.scss'],
})
export class ChatContainerComponent implements OnInit {
  messageControl = new FormControl('');
  messages: string[] = []
  constructor(private server: SocketsService) {

  }

  ngOnInit() {
    this.server.incomingMessage$.
    subscribe(message => this.messages.push(message))
  }

  send() {
    this.server.send(this.messageControl.value || '');
    this.messageControl.reset();
  }

}
