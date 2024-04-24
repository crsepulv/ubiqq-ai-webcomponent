import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AiChatComponent } from './ai-chat.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FilesLoaderComponent } from './components/files-loader/files-loader.component';
import { WelcomeViewComponent } from './components/welcome-view/welcome-view.component';
import { AutoResizeDirective } from './directives/auto-resize.directive';
import { GlobalService } from '../shared/services/global.service';
import { HttpClientModule } from '@angular/common/http';
import { CustomModalComponent } from './components/custom-modal/custom-modal.component';
import { ChatSidebarComponent } from './components/chat-sidebar/chat-sidebar.component';

@NgModule({
  declarations: [
    AiChatComponent,
    FilesLoaderComponent,
    CustomModalComponent,
    AutoResizeDirective,
    ChatSidebarComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    HttpClientModule,
    WelcomeViewComponent,
  ],
  providers: [GlobalService],
  exports: [AiChatComponent],
})
export class AiChatModule {}
