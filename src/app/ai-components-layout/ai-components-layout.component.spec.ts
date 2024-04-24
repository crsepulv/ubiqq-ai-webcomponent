import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiComponentsLayoutComponent } from './ai-components-layout.component';
import { AiChatComponent } from '../ai-chat/ai-chat.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FileTranscriptorComponent } from 'src/app/file-transcriptor/file-transcriptor.component';

describe('AiComponentsLayoutComponent', () => {
  let component: AiComponentsLayoutComponent;
  let fixture: ComponentFixture<AiComponentsLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AiComponentsLayoutComponent,
        AiChatComponent,
        FileTranscriptorComponent,
      ],
      imports: [ReactiveFormsModule, HttpClientModule],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(AiComponentsLayoutComponent);
    component = fixture.componentInstance;
    // Ahora configura el estado según sea necesario
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('app-ai-chat')).not.toBeNull();
  });

  it('deberia crearse', () => {
    expect(component).toBeTruthy();
  });

  it('deberia mostrar AiChatComponent por defecto', () => {
    component.componentToShow.component = 'ai-chat'; // Asegúrate de que el estado sea el esperado
    component.componentToShow.componentName = 'Asistente Virtual';

    fixture.detectChanges();
  
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('app-ai-chat')).not.toBeNull();
  });
  

});
