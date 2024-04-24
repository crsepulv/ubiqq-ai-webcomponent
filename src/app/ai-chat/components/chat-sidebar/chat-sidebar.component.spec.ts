import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatSidebarComponent } from './chat-sidebar.component';
import { By } from '@angular/platform-browser';

describe('ChatSidebarComponent', () => {
  let component: ChatSidebarComponent;
  let fixture: ComponentFixture<ChatSidebarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatSidebarComponent]
    });
    fixture = TestBed.createComponent(ChatSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debería renderizar el botón "Nueva Conversacion"', () => {
    const addConversationBtn = fixture.debugElement.query(By.css('.ai-chat-sidebar_add-conversation-btn'));
    expect(addConversationBtn).toBeTruthy();
  });

  it('debería emitir el evento "createNewConversation" al hacer clic en el botón "Nueva Conversacion"', () => {
    spyOn(component.createNewConversation, 'emit');
    const addConversationBtn = fixture.debugElement.query(By.css('.ai-chat-sidebar_add-conversation-btn'));
    addConversationBtn.triggerEventHandler('click', null);
    expect(component.createNewConversation.emit).toHaveBeenCalledOnceWith();
  });

  it('debería renderizar las conversaciones correctamente', () => {
    const testConversations = [
      { key: '1', value: { name: 'Conversación 1' } },
      { key: '2', value: { name: 'Conversación 2' } },
    ];
    component.iterateObjectArray = testConversations;
    fixture.detectChanges();

    const conversationLinks = fixture.debugElement.queryAll(By.css('.ai-chat-sidebar_conversation-link'));
    expect(conversationLinks.length).toEqual(testConversations.length);

    testConversations.forEach((conversation, index) => {
      const link = conversationLinks[index];
      const span = link.query(By.css('span'));
      expect(span.nativeElement.textContent).toEqual(conversation.value.name);
    });
  });

  it('debería emitir el evento "selectConversation" al hacer clic en una conversación', () => {
    const testConversation = { key: '1', value: { name: 'Conversación 1' } };
    component.iterateObjectArray = [testConversation];
    fixture.detectChanges();

    spyOn(component.selectConversation, 'emit');
    const conversationLink = fixture.debugElement.query(By.css('.ai-chat-sidebar_conversation-link'));
    conversationLink.triggerEventHandler('click', null);
    expect(component.selectConversation.emit).toHaveBeenCalledOnceWith(testConversation.key);
  });

  it('debería aplicar la clase "activate" a la conversación actual', () => {
    const testConversations = [
      { key: '1', value: { name: 'Conversación 1' } },
      { key: '2', value: { name: 'Conversación 2' } },
    ];
    component.iterateObjectArray = testConversations;
    component.currentConversationId = '1';
    fixture.detectChanges();

    const conversationLinks = fixture.debugElement.queryAll(By.css('.ai-chat-sidebar_conversation-link'));
    expect(conversationLinks[0].classes['activate']).toBeTruthy();
    expect(conversationLinks[1].classes['activate']).toBeFalsy();
  });

  it('debería emitir el evento "deleteConversation" al hacer clic en el botón de eliminación de la conversación', () => {
    const testConversation = { key: '1', value: { name: 'Conversación 1' } };
    component.iterateObjectArray = [testConversation];
    fixture.detectChanges();

    spyOn(component.deleteConversation, 'emit');
    const deleteBtn = fixture.debugElement.query(By.css('.ai-chat-sidebar_delete-conversation-btn'));
    deleteBtn.triggerEventHandler('click', null);
    expect(component.deleteConversation.emit).toHaveBeenCalledOnceWith(testConversation.key);
  });
});
