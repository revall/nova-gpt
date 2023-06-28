import { Component, OnDestroy, OnInit } from '@angular/core';
import { SocketsService } from './services/sockets.service';

@Component({
  selector: 'nova-gpt-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'nova-gpt';
  constructor(private socketService: SocketsService) {}
  
  ngOnInit() {
    this.socketService.setupSocketConnection();
  }

  ngOnDestroy() {
    this.socketService.disconnect();
  }
}
