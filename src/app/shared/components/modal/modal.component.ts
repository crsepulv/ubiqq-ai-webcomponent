import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  @Input() headerTitle: string = '';
  @Input() modalHeight!: string;
  @Input() showModal: boolean = false;
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  close(): void {
    this.closeModal.emit();
  }
}
