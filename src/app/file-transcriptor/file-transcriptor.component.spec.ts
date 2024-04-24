import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileTranscriptorComponent } from './file-transcriptor.component';
import { HttpClientModule } from '@angular/common/http';
import { FileSidebarComponent } from './components/file-sidebar/file-sidebar.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('FileTranscriptorComponent', () => {
  let component: FileTranscriptorComponent;
  let fixture: ComponentFixture<FileTranscriptorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FileTranscriptorComponent, FileSidebarComponent],
      imports: [HttpClientModule, ReactiveFormsModule]
    });
    fixture = TestBed.createComponent(FileTranscriptorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });
});
