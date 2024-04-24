import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[autoResize]',
})
export class AutoResizeDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('input', ['$event.target'])
  onInput(textarea: HTMLTextAreaElement): void {
    this.adjustTextareaSize(textarea);
  }

  ngAfterViewInit(): void {
    this.adjustTextareaSize(this.el.nativeElement);
  }
  
  resetTextareaSize(): void {
    this.adjustTextareaSize(this.el.nativeElement);
  }

   adjustTextareaSize(textarea: HTMLTextAreaElement): void {
    textarea.style.overflowX = 'hidden';
    textarea.style.height = 'min-content';
    textarea.style.height = textarea.scrollHeight + 'px';
  }
}
