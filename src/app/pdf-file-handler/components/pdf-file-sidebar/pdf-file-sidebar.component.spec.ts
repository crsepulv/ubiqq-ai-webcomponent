import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfFileSidebarComponent } from './pdf-file-sidebar.component';
import { HttpClientModule } from '@angular/common/http';

describe('PdfFileSidebarComponent', () => {
  let component: PdfFileSidebarComponent;
  let fixture: ComponentFixture<PdfFileSidebarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PdfFileSidebarComponent],
      imports: [HttpClientModule]
    });
    fixture = TestBed.createComponent(PdfFileSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
