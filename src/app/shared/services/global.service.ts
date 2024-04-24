import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  private showChatFileImportsModal = new Subject<boolean>();
  showChatFileImportsModal$ = this.showChatFileImportsModal.asObservable();

  openFileImportModal() {
    this.showChatFileImportsModal.next(true);
  }

  closeFileImportModal() {
    this.showChatFileImportsModal.next(false);
  }
}
