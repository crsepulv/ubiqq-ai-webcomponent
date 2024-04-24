import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid';
import { BlockBlobClient } from '@azure/storage-blob';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Alert } from '../shared/types';
import { StorageLocationResponse } from './types';

@Component({
  selector: 'app-file-transcriptor',
  templateUrl: './file-transcriptor.component.html',
  styleUrls: ['./file-transcriptor.component.scss'],
})
export class FileTranscriptorComponent {
  @ViewChild('transcriptionFileDropRef', { static: false })
  fileDropEl!: ElementRef;

  @Input() userid!: string;
  isShowSidebar: boolean = true;

  selectedFile: string = '';
  fileNameToShow: string = '';
  fileId: string = '';
  fileToUpload: File | null = null;
  token: string | null = null;
  uploadUrl: string | null = null;
  isLoading: boolean = false;
  isUploadedCompleted: boolean = false;
  metaDataForm: FormGroup;

  allowedFormats = [
    'audio/mp3',
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'audio/aac',
    'audio/mp4',
    'audio/x-m4a',
    'video/x-m4v',
    'video/mp4',
    'video/quicktime',
    'video/x-msvideo',
    'video/x-flv',
    'video/webm',
  ];

  languageOptions = [
    'English',
    'Spanish',
    'French',
    'German',
    'Chinese',
    'Japanese',
  ];
  speakerOptions = [1, 2, 3, 4, 5];

  notification = <Alert>{
    isShow: false,
    type: null,
    message: '',
  };

  checkScreenWidth() {
    if (window.innerWidth < 1000) {
      this.isShowSidebar = false;
    }
  }

  constructor(private http: HttpClient, public fb: FormBuilder) {
    this.checkScreenWidth();

    this.metaDataForm = this.fb.group({
      language: ['', [Validators.required, Validators.maxLength(500)]],
      numSpeakers: [0, [Validators.required]],
      nameOfTranscription: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  generateFileName(file: File): string {
    const fileId = uuidv4().replace(/[()]/g, '').substring(0, 10); // Elimina paréntesis y otros caracteres especiales
    this.fileId = fileId;

    const fileName = file.name;
    const fileExtension = fileName.substring(fileName.lastIndexOf('.')); // Obtiene la extensión del archivo

    let fileNameWithoutExtension = fileName.substring(
      0,
      fileName.lastIndexOf('.')
    ); // Obtiene el nombre del archivo sin la extensión
    fileNameWithoutExtension = fileNameWithoutExtension.replace(/\s+/g, ''); // Elimina espacios

    const truncatedFileName = fileNameWithoutExtension.substring(
      0,
      20 - fileExtension.length
    ); // Trunca el nombre del archivo sin afectar la extensión

    const urlFriendlyFileName = `${fileId}_${truncatedFileName}${fileExtension}`;
    return urlFriendlyFileName;
  }

  onFileDropped($file: FileList) {
    this.prepareFilesList($file[0]);
  }

  fileBrowseHandler($event: Event) {
    const inputElement = $event.target as HTMLInputElement;
    if (inputElement && inputElement.files) {
      this.prepareFilesList(inputElement.files[0]);
    } else {
      this.handleError('warning', 'Ha ocurrido un error, intentelo de nuevo');
    }
  }

  resetAll() {
    this.isUploadedCompleted = false;
    this.fileToUpload = null;
    this.fileNameToShow = '';
    this.fileId = '';
    this.selectedFile = '';
    this.token = null;
    this.uploadUrl = null;
  }

  prepareFilesList(file: File) {
    this.resetAll();

    this.fileToUpload = file;

    if (!this.fileToUpload) {
      this.showNotification('warning', 'No ha seleccionado ningún archivo.');
      return;
    }

    if (!this.checkFileSize(this.fileToUpload)) {
      this.showNotification(
        'warning',
        'El archivo excede el tamaño máximo permitido (300 MB).'
      );
      return;
    }

    this.fileNameToShow = this.fileToUpload.name;

    if (!this.isValidFormat(this.fileToUpload.type, this.allowedFormats)) {
      this.showNotification(
        'warning',
        `El archivo ${this.fileToUpload.name} tiene un formato no permitido.`
      );
      return;
    }

    this.selectedFile = this.generateFileName(file);
    this.getStorageData();
    this.fileDropEl.nativeElement.value = '';
  }

  isValidFormat(fileType: string, allowedFormats: string[]): boolean {
    // Verificar si el tipo de archivo está permitido
    return allowedFormats.some((format) => fileType.includes(format));
  }

  handleError(type: string, errorMessage: string) {
    this.showNotification(type, errorMessage);
    console.error(`Error: ${errorMessage}`);
    this.isLoading = false;
  }

  getStorageData() {
    this.http
      .post<StorageLocationResponse>(
        'https://ubiqq-upload-files.azurewebsites.net/api/blobupload',
        {
          container: 'ubiqq',
          blobName: this.selectedFile,
        }
      )
      .subscribe(
        (response) => {
          this.uploadUrl = response.response.uri;
          this.token = response.response.token;
          this.showNotification(
            'success',
            `Archivo ${
              this.fileToUpload ? this.fileToUpload.name : this.selectedFile
            }  con formato correcto`
          );
        },
        (error) => {
          this.handleError(
            'warning',
            'Ha ocurrido un error, intentelo de nuevo'
          );
        }
      );
  }

  validateSelectors() {
    const language = this.metaDataForm.get('language')?.value;
    const numSpeaker = this.metaDataForm.get('numSpeakers')?.value;
    const nameOfTranscription = this.metaDataForm.get(
      'nameOfTranscription'
    )?.value;

    return language &&
      numSpeaker &&
      nameOfTranscription &&
      language !== '' &&
      numSpeaker !== 0 &&
      nameOfTranscription !== ''
      ? true
      : false;
  }

  uploadFile() {
    this.isLoading = true;

    const language = this.metaDataForm.get('language')?.value;
    const numSpeaker = this.metaDataForm.get('numSpeakers')?.value;
    const nameOfTranscription = this.metaDataForm.get(
      'nameOfTranscription'
    )?.value;

    const encodedNameOfTranscription = encodeURIComponent(nameOfTranscription);


    if (this.validateSelectors()) {
      const metadata = {
        userid: this.userid,
        language,
        numSpeaker,
        fileid: this.fileId,
        alias: encodedNameOfTranscription,
      };

      if (this.fileToUpload && this.token && this.uploadUrl) {
        this.uploadFielAsChunks(
          this.fileToUpload,
          this.uploadUrl,
          uuidv4(),
          metadata
        );
      }
    } else {
      this.isLoading = false;
      this.showNotification(
        'warning',
        'Debe seleccionar seleccionar alguna de las opciones'
      );
    }
  }

  async uploadFielAsChunks(
    file: File,
    sasUrl: string,
    nombreBlob: string,
    metadata: {}
  ) {
    try {
      const blockSize = 4 * 1024 * 1024; // 4MB block size
      const blockBlobClient = new BlockBlobClient(sasUrl);
      const fileSize = file.size;
      const totalBloques = Math.ceil(fileSize / blockSize);
      const bloquesSubidos = [];

      for (let i = 0; i < totalBloques; i++) {
        const offset = i * blockSize;
        const end = i === totalBloques - 1 ? fileSize : offset + blockSize;
        const blobPart = file.slice(offset, end);

        const blockId = btoa(String(i).padStart(5, '0'));
        await blockBlobClient.stageBlock(blockId, blobPart, blobPart.size);

        bloquesSubidos.push(blockId);
      }

      await blockBlobClient.commitBlockList(bloquesSubidos);
      await blockBlobClient.setMetadata(metadata);

      this.showNotification(
        'success',
        'El archivo se está transcribiendo actualmente. Te notificaremos por correo electrónico una vez completado el proceso.'
      );
      this.isUploadedCompleted = true;
    } catch {
      this.showNotification(
        'warning',
        'Ha ocurrido un error al enviar el archivo, intentelo de nuevo'
      );
    } finally {
      this.isLoading = false;
    }
  }

  formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  checkFileSize(file: File): boolean {
    const maxFileSizeInBytes = 300 * 1024 * 1024; // Convertir 300 MB a bytes
    const fileSizeInBytes = file.size;

    if (fileSizeInBytes > maxFileSizeInBytes) {
      return false;
    }

    return true;
  }

  showSidebar() {
    this.isShowSidebar = !this.isShowSidebar;
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
