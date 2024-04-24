import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiChatComponent } from './ai-chat.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { AutoResizeDirective } from './directives/auto-resize.directive';
import { By } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

describe('AiChatComponent', () => {
  let component: AiChatComponent;
  let fixture: ComponentFixture<AiChatComponent>;
  let textareaDebugElement: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AiChatComponent, AutoResizeDirective],
      imports: [FormsModule, ReactiveFormsModule, HttpClientModule],
      schemas: [NO_ERRORS_SCHEMA], // Agrega esta línea
    });
    fixture = TestBed.createComponent(AiChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    textareaDebugElement = fixture.debugElement.query(
      By.css('textarea[autoResize]')
    );
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario messageForm', () => {
    expect(component.messageForm).toBeDefined();
  });

  it('debería agregar el mensaje del usuario al chat', async () => {
    component.createNewConversation();

    // Simular entrada del usuario
    component.messageForm.get('message')?.setValue('Mensaje de prueba');

    // Activar sendMessage
    await component.sendMessage(new Event('submit'));

    // Verificar si el mensaje se agregó
    expect(
      component.conversations[component.currentConversationId].messages.length
    ).toBeGreaterThan(0);
    expect(
      component.conversations[component.currentConversationId].messages[
        component.conversations[component.currentConversationId].messages
          .length - 1
      ].owner
    ).toEqual('user_r');
    expect(
      component.conversations[component.currentConversationId].messages[
        component.conversations[component.currentConversationId].messages
          .length - 1
      ].text
    ).toEqual('Mensaje de prueba');
  });

  it('debería tener la directiva AutoResizeDirective en el textarea', () => {
    const autoResizeDirective =
      textareaDebugElement.injector.get(AutoResizeDirective);
    expect(autoResizeDirective).toBeTruthy();
  });

  it('debería ajustar el tamaño del textarea en respuesta a la entrada', () => {
    // Puedes simular la entrada directamente aquí, si es necesario
    const textarea = textareaDebugElement.nativeElement as HTMLTextAreaElement;
    textarea.dispatchEvent(new Event('input'));

    // Verifica si el tamaño del textarea se ajustó
    expect(textarea.style.height).not.toEqual('auto');
  });
});
