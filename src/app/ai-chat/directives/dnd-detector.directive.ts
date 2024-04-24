import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appDndDetector]',
})
export class DndDetectorDirective {
  constructor() {}

  @Output() dragDetected = new EventEmitter<void>();

  @HostListener('dragover', ['$event']) onDragOver(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.dragDetected.emit();
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.dragDetected.emit();
  }
}
