import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfFileHandlerComponent } from './pdf-file-handler.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PdfFileSidebarComponent } from './components/pdf-file-sidebar/pdf-file-sidebar.component';



@NgModule({
  declarations: [
    PdfFileHandlerComponent,
    PdfFileSidebarComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule
  ],
  exports: [PdfFileHandlerComponent]
})
export class PdfFileHandlerModule { }
