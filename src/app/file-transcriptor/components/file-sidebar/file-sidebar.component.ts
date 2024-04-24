import { HttpClient } from '@angular/common/http';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FilesResults, FilesTranscriptedList } from '../../types';

@Component({
  selector: 'app-file-sidebar',
  templateUrl: './file-sidebar.component.html',
  styleUrls: ['./file-sidebar.component.scss'],
})
export class FileSidebarComponent implements OnInit, OnChanges {
  @Input() userid!: string;

  @Input() isShowSidebar: boolean = true;
  @Input() currentConversationId: string = '';
  @Input() isUploadCompleted: boolean = false;
  @Input() fileToUpload: File | null = null;
  filesTranscriptedList: FilesTranscriptedList = [];
  isLoading: boolean = false;

  constructor(public http: HttpClient) {}

  ngOnInit(): void {
    if (this.userid) {
      this.isLoading = true;
      this.http
        .get<FilesTranscriptedList>(
          `https://ubiqq-upload-files.azurewebsites.net/api/search/${this.userid}?type=transcription`
        )
        .subscribe(
          (data) => {
            this.filesTranscriptedList = data.sort((a, b) => {
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
          `https://ubiqq-upload-files.azurewebsites.net/api/search/${this.userid}?type=transcription`
        )
        .subscribe(
          (data) => {
            this.filesTranscriptedList = data.sort((a, b) => {
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
      const parts = fileNameWithExtension.split('-');
      if (parts.length > 1) {
        // Si hay al menos dos partes después de dividir por guion
        parts.shift(); // Quitar la primera parte que es el correo electrónico
        return parts.join('-').split('.').slice(0, -1).join('.'); // Eliminar la extensión del nombre del archivo
      } else {
        return fileNameWithExtension.split('.').slice(0, -1).join('.'); // No hay guion, eliminar solo la extensión del nombre del archivo
      }
    }
    return '';
  }
}
