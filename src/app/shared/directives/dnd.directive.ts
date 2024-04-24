import {
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appDnd]',
})
export class DndDirective {
  @HostBinding('class.fileover') fileOver!: boolean;
  @Output() fileDropped = new EventEmitter<FileList>();

  constructor() {}
  @HostListener('dragover', ['$event']) onDragOver(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.fileOver = true;
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.fileOver = false;
  }

  @HostListener('drop', ['$event']) public onDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.fileOver = false;
  
    // Verificar si dataTransfer no es null antes de acceder a files
    if (e.dataTransfer && e.dataTransfer.files) {
      let files = e.dataTransfer.files;
      if (files.length > 0) {
        this.fileDropped.emit(files);
      }
    }
  }
  
}
