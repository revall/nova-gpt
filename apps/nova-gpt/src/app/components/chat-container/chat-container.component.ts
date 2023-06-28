import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SocketsService } from '../../services/sockets.service';

@Component({
  selector: 'nova-gpt-chat-container',
  templateUrl: './chat-container.component.html',
  styleUrls: ['./chat-container.component.scss'],
})
export class ChatContainerComponent {
  messageControl = new FormControl('');
  constructor(private server: SocketsService) {

  }

  send() {
    this.server.send(this.messageControl.value || '');
    this.messageControl.reset();
  }

}
