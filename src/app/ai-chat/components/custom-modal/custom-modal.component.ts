import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { GlobalService } from 'src/app/shared/services/global.service';

@Component({
  selector: 'app-custom-modal',
  templateUrl: './custom-modal.component.html',
  styleUrls: ['./custom-modal.component.scss'],
})
export class CustomModalComponent {
  @Input() headerTitle: string = '';
  @Input() modalHeight!: string;
  showModal: boolean = false;
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  private ngUnsubscribe = new Subject();

  constructor(private globalService: GlobalService) {
    this.globalService.showChatFileImportsModal$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((showModal) => {
        this.showModal = showModal;
      });
  }

  closeModalFromService() {
    this.globalService.closeFileImportModal();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next(false);
    this.ngUnsubscribe.complete();
  }
}
