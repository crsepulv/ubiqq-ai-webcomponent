import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {
  FilesResults,
  FilesTranscriptedList,
} from 'src/app/file-transcriptor/types';

@Component({
  selector: 'app-pdf-file-sidebar',
  templateUrl: './pdf-file-sidebar.component.html',
  styleUrls: ['./pdf-file-sidebar.component.scss'],
})
export class PdfFileSidebarComponent implements OnInit, OnChanges {
  @Input() userid!: string;

  @Input() isShowSidebar: boolean = true;
  @Input() currentConversationId: string = '';
  @Input() isUploadCompleted: boolean = false;
  @Input() fileToUpload: File | null = null;
  completedFilesList: FilesTranscriptedList = [];
  isLoading: boolean = false;

  constructor(public http: HttpClient) {}

  ngOnInit(): void {
    if (this.userid) {
      this.isLoading = true;

      this.http
        .get<FilesTranscriptedList>(
          `https://ubiqq-upload-files.azurewebsites.net/api/search/${this.userid}?type=ocr`
        )
        .subscribe(
          (data) => {
            this.completedFilesList = data.sort((a, b) => {
              return new Date(b.date).getTime() - new Date(a.date).getTime();
            });
          },
          (error) => {
            console.log('Error', error);
          },
          () => {
            this.isLoading = false;
          }
        );
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userid'] && !changes['userid'].firstChange) {
      this.updateTranscriptedList();
    }
  }

  updateTranscriptedList() {
    if (this.userid) {
      this.isLoading = true;
      this.http
        .get<FilesTranscriptedList>(
          `https://ubiqq-upload-files.azurewebsites.net/api/search/${this.userid}?type=ocr`
        )
        .subscribe(
          (data) => {
            this.completedFilesList = data.sort((a, b) => {
              return new Date(b.date).getTime() - new Date(a.date).getTime();
            });
          },
          (error) => {
            console.log('Error', error);
          },
          () => {
            this.isLoading = false;
          }
        );
    }
  }

  validateAlias(file: FilesResults) {
    let alias = file.metadata?.alias;
    return alias ? decodeURIComponent(alias) : this.extractFileName(file.name);
  }

  extractFileName(url: string): string {
    // Extraer el nombre del archivo de la URL
    const fileNameWithExtension = url.split('/').pop(); // Obtener el último segmento de la URL (el nombre del archivo con extensión)
    if (fileNameWithExtension) {
      return fileNameWithExtension.split('.').slice(0, -1).join('.'); // Eliminar la extensión del nombre del archivo
    }
    return '';
  }
}
