import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-chat-sidebar',
  templateUrl: './chat-sidebar.component.html',
  styleUrls: ['./chat-sidebar.component.scss'],
})
export class ChatSidebarComponent {
  @Input() isShowSidebar: boolean = true;
  @Input() currentConversationId: string = '';
  @Input() iterateObjectArray: { key: string; value: any }[] = [];
  @Input() loader!: boolean;

  @Output() selectConversation = new EventEmitter<string>();
  @Output() createNewConversation = new EventEmitter<void>();
  @Output() deleteConversation = new EventEmitter<string>();

  EmmitCreateNewConversation() {
    if (!this.loader) {
      this.createNewConversation.emit();
    }
  }

  EmmitSelectConversation(id: string) {
    if (!this.loader) {
      this.selectConversation.emit(id);
    }
  }

  EmmitDeleteConversation(id: string) {
    if (!this.loader) {
      this.deleteConversation.emit(id);
    }
  }
}
