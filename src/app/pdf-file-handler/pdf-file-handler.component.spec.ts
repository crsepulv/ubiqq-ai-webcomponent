import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfFileHandlerComponent } from './pdf-file-handler.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { PdfFileSidebarComponent } from './components/pdf-file-sidebar/pdf-file-sidebar.component';

describe('PdfFileHandlerComponent', () => {
  let component: PdfFileHandlerComponent;
  let fixture: ComponentFixture<PdfFileHandlerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PdfFileHandlerComponent, PdfFileSidebarComponent],
      imports: [HttpClientModule, ReactiveFormsModule]
    });
    fixture = TestBed.createComponent(PdfFileHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
