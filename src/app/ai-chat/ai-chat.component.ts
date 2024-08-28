import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { Subject } from 'rxjs';
import { GlobalService } from '../shared/services/global.service';
import { userQuestions } from './utils';
import { AutoResizeDirective } from './directives/auto-resize.directive';
import {
  AiChatResponse,
  ChatMessage,
  ConversationValues,
  Conversations,
  TransformedMessage,
} from './types';

const API_URL = 'https://ubiqq-upload-files.azurewebsites.net/api/chatGPT';

@Component({
  selector: 'app-ai-chat',
  templateUrl: './ai-chat.component.html',
  styleUrls: ['./ai-chat.component.scss'],
})
export class AiChatComponent {
  isShowSidebar: boolean = true;
  showDeleteModal: boolean = false;
  selectDeleteElementId: string = '';
  isShowHelpModal: boolean = false;
  userQuestions = userQuestions;
  isLoading: boolean = false;

  messageForm: FormGroup;
  messages: ChatMessage[] = [];
  conversations: Conversations = {};
  currentConversationId: string = '';

  chatInputHeight!: string;
  chatConversationHeight!: string;
  private previousScrollHeight: number = 0;
  isCopiedSuccess = false;

  private ngUnsubscribe = new Subject();

  @ViewChild('messageTextarea') messageTextarea!: ElementRef;
  @ViewChild(AutoResizeDirective) autoResizeDirective!: AutoResizeDirective;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    // Volver a verificar cuando cambia el tamaño de la ventana
    this.checkScreenWidth();
  }

  checkScreenWidth() {
    if (window.innerWidth < 1000) {
      this.isShowSidebar = false;
    }
  }

  @ViewChild('conversationContainer') conversationContainer!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public cdr: ChangeDetectorRef,
    private globalService: GlobalService
  ) {
    this.checkScreenWidth();

    // Inicializa el formulario con validación
    this.messageForm = this.fb.group({
      message: ['', [Validators.required, Validators.maxLength(30000)]],
    });
  }

  closeModalFromService() {
    this.globalService.closeFileImportModal();
  }

  openModalFromService() {
    this.globalService.openFileImportModal();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next(false);
    this.ngUnsubscribe.complete();
  }

  ngOnInit(): void {
    this.getConversationsToLocalStorage();
    const keys = this.getObjectKeys(this.conversations);
    this.currentConversationId = keys[0];
  }

  getObjectKeys(obj: Conversations): string[] {
    return Object.keys(obj);
  }

  iterateObjectKeysAndValues(
    obj: Conversations
  ): { key: string; value: ConversationValues }[] {
    return Object.entries({ ...obj }).map(([key, value]) => ({ key, value }));
  }

  showSidebar() {
    this.isShowSidebar = !this.isShowSidebar;
  }

  transformMessagesForOpenAI(messages: ChatMessage[]): TransformedMessage[] {
    return messages.map((message) => {
      return {
        role: message.owner === 'user_l' ? 'assistant' : 'user',
        content: message.text,
      };
    });
  }

  sendMessage($event: Event) {
    $event.preventDefault();

    if (Object.keys(this.conversations).length <= 0) {
      this.createNewConversation();
    }

    const userMessage = this.messageForm.get('message')?.value.trim();
    const currentConversationId = this.currentConversationId;

    this.conversations[this.currentConversationId].messages.push({
      owner: 'user_r',
      text: userMessage,
      timestamp: new Date(),
      isCopiedSuccess: false,
    });
    this.messageForm.get('message')?.setValue('');
    this.autoResizeDirective.resetTextareaSize();

    // Llamar a OpenAI para obtener la respuesta
    this.chatRequest(currentConversationId);
  }

  selectConversation(id: string): void {
    // Guarda la conversación actual antes de cambiar
    this.saveConversationsToLocalStorage();
    // Establece la nueva conversación como la actual
    this.currentConversationId = id;
  }

  notEmptyConversation() {
    const currentConversation = this.conversations[this.currentConversationId];
    return currentConversation?.messages.length > 0;
  }

  emptyConversation() {
    const currentConversation = this.conversations[this.currentConversationId];
    return (
      !currentConversation?.messages ||
      currentConversation.messages.length === 0
    );
  }

  createNewConversation(): void {
    const newConversationId = uuidv4();
    this.conversations[newConversationId] = {
      messages: [],
      name: 'nuevo chat',
    };
    this.selectConversation(newConversationId);
    this.saveConversationsToLocalStorage(); // Guardar las conversaciones actualizadas en el LocalStorage
  }

  saveCurrentConversation(): void {
    this.conversations[this.currentConversationId] = {
      messages: this.messages,
      name: this.messages[0].text,
    };

    this.saveConversationsToLocalStorage(); // Guardar las conversaciones actualizadas en el LocalStorage
  }

  saveMessageToLocal(message: ChatMessage): void {
    const currentConversationId = this.currentConversationId;

    if (currentConversationId) {
      if (!this.conversations[currentConversationId]) {
        this.conversations[currentConversationId] = {
          messages: [],
          name: 'nuevo chat',
        };
      }

      // Agregar el nuevo mensaje al arreglo y guardarlo en el LocalStorage
      this.conversations[currentConversationId]?.messages.push(message);
      this.saveConversationsToLocalStorage(); // Guardar las conversaciones actualizadas en el LocalStorage
    }
  }

  // Función para guardar las conversaciones en el LocalStorage
  saveConversationsToLocalStorage(): void {
    localStorage.setItem('conversations', JSON.stringify(this.conversations));
  }

  getConversationsToLocalStorage() {
    const storedConversations = localStorage.getItem('conversations');

    // Si hay mensajes almacenados, convertirlos a un array, de lo contrario, inicializar un array vacío
    const existingConversations = storedConversations
      ? JSON.parse(storedConversations)
      : {};

    this.conversations = existingConversations;
  }

  openDeleteModal(id: string) {
    this.showDeleteModal = true;
    this.selectDeleteElementId = id;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
  }

  deleteConversation(id: string) {
    if (this.conversations.hasOwnProperty(id)) {
      delete this.conversations[id];
      // Guarda las conversaciones actualizadas en el LocalStorage después de eliminar
      this.saveConversationsToLocalStorage();

      const keys = this.getObjectKeys(this.conversations);

      this.currentConversationId = keys[0];

      this.closeDeleteModal();
    } else {
      // console.log(`Conversation with id ${id} not found`);
      this.closeDeleteModal();
    }
  }

  chatRequest(currentConversationId: string) {
    this.isLoading = true;

    const messages = this.conversations[currentConversationId].messages;

    // Calcular la longitud total de los mensajes en el contexto de la conversación
    const totalLength = messages.reduce(
      (acc, message) => acc + message.text.length,
      0
    );

    // Verificar si la longitud total excede el límite de 30,000 caracteres
    if (totalLength >= 30000) {
      // Si excede el límite, enviar solo el último mensaje
      const lastMessage = messages[messages.length - 1];
      const conversationHistory = this.transformMessagesForOpenAI([
        lastMessage,
      ]);

      // Realizar la solicitud solo con el último mensaje
      this.http
        .post<AiChatResponse>(API_URL, { messages: conversationHistory })
        .subscribe(
          (response) => {
            const chatbotResponse = response?.message || '';
           // console.log(response);

            // Agregar la respuesta del chatbot al contexto de la conversación
            this.conversations[currentConversationId].messages.push({
              owner: 'user_l',
              text: chatbotResponse,
              timestamp: new Date(),
              isCopiedSuccess: false,
            });
            this.conversations[currentConversationId].name =
              this.conversations[currentConversationId].messages[0].text;

            // Guardar las conversaciones actualizadas en el LocalStorage
            localStorage.setItem(
              'conversations',
              JSON.stringify(this.conversations)
            );
          },
          (error) => {
            console.log(error);
            // Agregar un mensaje de error al contexto de la conversación
            this.conversations[currentConversationId].messages.push({
              owner: 'user_l',
              text: 'Ha ocurrido un error, vuelva a intentarlo',
              timestamp: new Date(),
              isCopiedSuccess: false,
            });
          }
        )
        .add(() => {
          this.isLoading = false;
        });
    } else {
      // Si no excede el límite, enviar todos los mensajes en el contexto

      const conversationHistory = this.transformMessagesForOpenAI(messages);

      // Realizar la solicitud con todos los mensajes en el contexto
      this.http
        .post<AiChatResponse>(API_URL, { messages: conversationHistory })
        .subscribe(
          (response) => {
            const chatbotResponse = response?.message || '';
            // console.log(response);

            // Agregar la respuesta del chatbot al contexto de la conversación
            this.conversations[currentConversationId].messages.push({
              owner: 'user_l',
              text: chatbotResponse,
              timestamp: new Date(),
              isCopiedSuccess: false,
            });
            this.conversations[currentConversationId].name =
              this.conversations[currentConversationId].messages[0].text;

            // Guardar las conversaciones actualizadas en el LocalStorage
            localStorage.setItem(
              'conversations',
              JSON.stringify(this.conversations)
            );
          },
          (error) => {
            console.log(error);
            // Agregar un mensaje de error al contexto de la conversación
            this.conversations[currentConversationId].messages.push({
              owner: 'user_l',
              text: 'Ha ocurrido un error, vuelva a intentarlo',
              timestamp: new Date(),
              isCopiedSuccess: false,
            });
          }
        )
        .add(() => {
          this.isLoading = false;
        });
    }
  }

  ngAfterViewChecked(): void {
    const container = this.conversationContainer.nativeElement;
    const shouldScroll = container.scrollHeight !== this.previousScrollHeight;

    if (shouldScroll) {
      this.scrollToBottomSmooth();
      this.previousScrollHeight = container.scrollHeight;
    }
  }

  handleKeyDown(event: KeyboardEvent): void {
    const userMessage = this.messageForm.get('message')?.value.trim();

    if (
      event.key === 'Enter' &&
      !event.shiftKey &&
      userMessage !== '' &&
      !this.isLoading &&
      this.messageForm.valid
    ) {
      event.preventDefault();
      this.autoResizeDirective.resetTextareaSize();

      this.sendMessage(event);
    }
  }

  copyMessage(message: ChatMessage) {
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = message.text;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextArea);

    message.isCopiedSuccess = true;

    setTimeout(() => {
      message.isCopiedSuccess = false;
    }, 3000);
  }

  usePrompt(prompt: string) {
    this.messageForm.get('message')?.setValue(prompt);
    this.closeHelpModal();
  }

  showHelpModal() {
    this.isShowHelpModal = !this.isShowHelpModal;
    this.cdr.detectChanges();
  }

  closeHelpModal() {
    this.isShowHelpModal = false;
    this.cdr.detectChanges();
  }

  scrollToBottomSmooth(): void {
    const container = this.conversationContainer.nativeElement;
    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth',
    });
  }

  checkMessageLength(
    messages: ChatMessage[],
    newMessage: ChatMessage
  ): ChatMessage[] {
    const totalLength = messages.reduce(
      (acc, message) => acc + message.text.length,
      0
    );
    const maxLength = 30000;
    const remainingLength = maxLength - totalLength;

    if (remainingLength < newMessage.text.length) {
      let currentLength = remainingLength;
      let index = 0;
      while (
        currentLength < newMessage.text.length &&
        index < messages.length
      ) {
        currentLength += messages[index].text.length;
        index++;
      }
      return messages.slice(index);
    } else {
      return messages;
    }
  }
}
