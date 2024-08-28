import { Component, ElementRef, ViewChild } from '@angular/core';
import { GlobalService } from 'src/app/shared/services/global.service';
import { Alert } from 'src/app/shared/types';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-files-loader',
  templateUrl: './files-loader.component.html',
  styleUrls: ['./files-loader.component.scss'],
})
export class FilesLoaderComponent {
  @ViewChild('fileDropRef', { static: false }) fileDropEl!: ElementRef;

  files: any[] = [];

  selectedFile!: string;
  fileNameToShow!: string;
  fileToUpload: any;
  fileOver!: boolean;

  notification = <Alert>{
    isShow: false,
    type: null,
    message: '',
  };

  constructor(private globalService: GlobalService) {}

  closeModalFromService() {
    this.globalService.closeFileImportModal();
    this.files = [];
    this.resetAlert();
  }

  generateFileName(file: File): string {
    const fileId = uuidv4().replace(/[()]/g, '');
    const fileNameWithoutSpaces = file.name
      .replace(/\s+/g, '')
      .replace(/[()]/g, '');
    const urlFriendlyFileName = `${fileId}_${fileNameWithoutSpaces}`;
   //  console.log(urlFriendlyFileName);
    return urlFriendlyFileName;
  }

  readInputFile($event: any) {
    this.selectedFile = '';
    this.fileNameToShow = '';

    const files = $event.target.files;
    if (files && files.length > 0) {
      this.fileToUpload = files[0];
      this.fileNameToShow = files[0].name;

      this.selectedFile = this.generateFileName(files[0]);
      // console.log(this.selectedFile);
    }
  }

  onFileDropped($event: any) {
    this.prepareFilesList($event);
  }

  fileBrowseHandler($event: any) {
    this.prepareFilesList($event.target.files);
  }

  deleteFile(index: number) {
    if (this.files[index].progress < 100) {
     //  console.log('Upload in progress.');
      return;
    }
    this.files.splice(index, 1);
  }

  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 5;
          }
        }, 40);
      }
    }, 200);
  }

  prepareFilesList(files: Array<any>) {
    const allowedFormats = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf',
      'text/plain',
    ];

    for (const item of files) {
      if (this.isValidFormat(item.type, allowedFormats)) {
        item.progress = 0;
        this.files.push(item);
        this.resetAlert();
      } else {
        // Puedes manejar la lógica de error aquí, por ejemplo, mostrar un mensaje al usuario.
        console.error(`El archivo ${item.name} tiene un formato no permitido.`);
        this.showNotification(
          'warning',
          `El archivo ${item.name} tiene un formato no permitido.`
        );
      }
    }

    this.fileDropEl.nativeElement.value = '';
    this.uploadFilesSimulator(0);
  }

  isValidFormat(fileType: string, allowedFormats: string[]): boolean {
    // Verificar si el tipo de archivo está permitido
    return allowedFormats.some((format) => fileType.includes(format));
  }

  formatBytes(bytes: any, decimals = 2) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  closeAlert() {
    this.notification = {
      isShow: false,
      type: null,
      message: '',
    };
  }

  resetAlert() {
    this.notification = {
      isShow: false,
      type: null,
      message: '',
    };
  }

  showNotification(type: string, message: string) {
    this.notification = {
      isShow: true,
      type: type,
      message: message,
    };
  }
}
