import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
  } from '@nestjs/websockets';
  import { Logger } from '@nestjs/common';
  import { from, Observable } from 'rxjs';
  import { map } from 'rxjs/operators';
  import { Server } from 'socket.io';
import { ChatGptService } from '../services/chat-gpt/chat-gpt.service';
import { NovaChatMessage } from '@nova-gpt/models'
  
  @WebSocketGateway({
    cors: {
      origin: '*',
    },
  })
  export class EventsGateway {
    @WebSocketServer()
    server: Server;
    constructor(private logger: Logger,private gpt: ChatGptService) {}
    // @SubscribeMessage('events')
    // findAll(@MessageBody() data: any): Observable<WsResponse<number>> {

    //   return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
    // }

    @SubscribeMessage('message')
    async process(@MessageBody() data: string): Promise<unknown> {
      this.logger.log({ event: 'message', data }, 'Incoming message')
      const answer = await this.gpt.ask(data)
      const response:NovaChatMessage = { event: 'message', data:answer, source: 'server'  }
      this.logger.log(response, 'Response message')
      return response;
    }
  
  }