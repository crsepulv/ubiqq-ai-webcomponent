import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileSidebarComponent } from './file-sidebar.component';
import {  HttpClientModule } from '@angular/common/http';

describe('FileSidebarComponent', () => {
  let component: FileSidebarComponent;
  let fixture: ComponentFixture<FileSidebarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FileSidebarComponent],
      imports: [HttpClientModule]
    });
    fixture = TestBed.createComponent(FileSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });
});
