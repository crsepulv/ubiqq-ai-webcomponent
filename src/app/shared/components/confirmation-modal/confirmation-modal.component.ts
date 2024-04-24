import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss'],
})
export class ConfirmationModalComponent {
  @Input() isDoAction!: boolean;
  @Input() validator!: boolean;
  @Input() showConfirmationModal!: boolean;
  @Input() headerTitle!: string;
  @Input() DoingActionText!: string;
  @Input() ActionToDoText!: string;
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
  @Output() deleteElement: EventEmitter<void> = new EventEmitter<void>();

  EmmitDeleteElement(): void {
    this.deleteElement.emit();
  }

  EmmitCloseModal(): void {
    this.closeModal.emit();
  }
}
