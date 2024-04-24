import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileTranscriptorComponent } from './file-transcriptor.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FileSidebarComponent } from './components/file-sidebar/file-sidebar.component';



@NgModule({
  declarations: [FileTranscriptorComponent, FileSidebarComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule
  ],
  exports: [FileTranscriptorComponent]
})
export class FileTranscriptorModule { }
