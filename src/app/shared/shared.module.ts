import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './components/modal/modal.component';
import { LoaderComponent } from './components/loader/loader.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { DndDetectorDirective } from '../ai-chat/directives/dnd-detector.directive';
import { DndDirective } from './directives/dnd.directive';

@NgModule({
  declarations: [
    ModalComponent,
    LoaderComponent,
    ConfirmationModalComponent,
    DndDetectorDirective,
    DndDirective,
  ],
  imports: [CommonModule],
  exports: [
    ModalComponent,
    LoaderComponent,
    ConfirmationModalComponent,
    DndDetectorDirective,
    DndDirective,
  ],
})
export class SharedModule {}
