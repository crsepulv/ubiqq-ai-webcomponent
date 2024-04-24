import { NgModule, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './shared/shared.module';
import { AiComponentsLayoutComponent } from './ai-components-layout/ai-components-layout.component';
import { FileTranscriptorModule } from './file-transcriptor/file-transcriptor.module';
import { AiChatModule } from './ai-chat/ai-chat.module';
import { PdfFileHandlerModule } from './pdf-file-handler/pdf-file-handler.module';

@NgModule({
  declarations: [AiComponentsLayoutComponent],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    AiChatModule,
    SharedModule,
    PdfFileHandlerModule,
    FileTranscriptorModule,
  ],
})
export class AppModule {
  constructor(private injector: Injector) {
    const ubiqqaiComponents = createCustomElement(AiComponentsLayoutComponent, {
      injector,
    });
    customElements.define('ubiqq-ai-components', ubiqqaiComponents);
  }
  ngDoBootstrap() {}
}
