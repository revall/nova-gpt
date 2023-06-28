import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { ChatContainerComponent } from './components/chat-container/chat-container.component';
import { ChatMessageComponent } from './components/chat-message/chat-message.component';
import { SocketsService } from './services/sockets.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    ChatContainerComponent,
    ChatContainerComponent,
    ChatMessageComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes, { initialNavigation: 'enabledBlocking' }),
  ],
  providers: [SocketsService],
  bootstrap: [AppComponent],
})
export class AppModule {}
