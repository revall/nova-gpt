import { Logger, Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { ChatGptService } from '../services/chat-gpt/chat-gpt.service';

@Module({
  providers: [EventsGateway ,Logger, ChatGptService],
})
export class EventsModule {}