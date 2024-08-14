import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { AiChatComponent } from '../ai-chat/ai-chat.component';
import { ComponentToShow } from './types';
import { ConfService } from '../conf/conf.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-ai-components-layout',
  templateUrl: './ai-components-layout.component.html',
  styleUrls: ['./ai-components-layout.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class AiComponentsLayoutComponent implements OnInit, OnChanges {
  @Input() userid: string = 'userid';
  @Input() room!: string;
  @Input() config: string = '';

  styles: any = {};
  conf: any = {};

  isShowSidebar: boolean = true;

  componentToShow: ComponentToShow = {
    componentName: 'Asistente virtual TIRONI',
    component: 'ai-chat',
  };

  modules = {
    'ai-chat': {
      label: 'Chat de IA',
    },
    'ai-file-transcriptor': {
      label: 'Transcriptor de audio y video',
    },
    'ai-pdf-file-handler': {
      label: 'Conversor PDF/Imagen a Texto',
    },
  };

  @ViewChild('aiChatComponent') aiChatComponent!: AiChatComponent;
  isShowMobileMenu: boolean = false;

  constructor(
    private cdr: ChangeDetectorRef,
    public confService: ConfService,
    public http: HttpClient
  ) {}

  iterateObjectKeysAndValues(obj: any): { key: string; value: any }[] {
    return Object.entries({ ...obj }).map(([key, value]) => ({ key, value }));
  }

  ngOnInit(): void {
    if (this.room) {
      this.getConf();
    } else if(this.config) {
      this.getAttributeConf();
    }

    console.log(this.conf);

    console.log(this.confService.conf.value);

    const savedShowDefaultComponent = localStorage.getItem('componentToShow');

    if (savedShowDefaultComponent !== null) {
      this.componentToShow = JSON.parse(savedShowDefaultComponent);

      if (!this.componentToShow.component) {
        localStorage.removeItem('showDefaultComponent');
      }
    }
  }

  getAttributeConf() {
    try {
      // Decodificar base64 a string
      const jsonString = atob(this.config);

      // Convertir el string JSON a un objeto
      const decodedJson = JSON.parse(jsonString);

      console.log(decodedJson); // Verifica el resultado en la consola

      this.dataTransform(decodedJson.aiConfig.css);
      this.conf = decodedJson.aiConfig.welcomeView;
      this.confService.conf.next({
        ...decodedJson.aiConfig.welcomeView,
      });
      console.log(this.styles);

    } catch (error) {
      console.error('Error al manejar el input base64', error);
    }
  }

  getConf() {
    this.http.get(`./assets/ai.config.json`).subscribe(
      (conf: any) => {
        this.dataTransform(conf.aiConfig.css);
        this.conf = conf.aiConfig.welcomeView;
        this.confService.conf.next({
          ...conf.aiConfig.welcomeView,
        });
        console.log(this.styles);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  dataTransform(css: any) {
    this.styles = {
      '--header-bg': css?.header?.background ?? '',
      '--header-color': css?.header?.color ?? '',
      '--header-active-color': css?.header?.['active-color'] ?? '',
      '--border-color': css?.general?.borders?.['border-color'] ?? '',
      '--border-width': css?.general?.borders?.['border-width'] ?? '',
      '--border-style': css?.general?.borders?.['border-style'] ?? '',
      '--radius': css?.general?.borders?.['border-radius'] ?? '',
      '--container-bg': css?.general?.background ?? '',
      '--container-color': css?.general?.color ?? '',
      '--menu-bg': css?.sidebarAndMenu?.background ?? '',
      '--menu-color': css?.sidebarAndMenu?.color ?? '',
      '--chat-bg': css?.chat?.background ?? '',
      '--user-message-bg': css?.chat?.['user-message']?.background ?? '',
      '--user-message-color': css?.chat?.['user-message']?.color ?? '',
      '--font-family': css?.general?.font?.['font-family'] ?? '',
      '--font-size-base': css?.general?.font?.['font-size'] ?? '',
      '--font-normal': css?.general?.font?.['font-weight'] ?? '',  // Nota: Cambié 'font-wieght' a 'font-weight'
      '--font-bold': css?.general?.font?.['font-weight'] ?? '',
      '--input-bg': css?.general?.inputs?.background ?? '',
      '--input-color': css?.general?.inputs?.color ?? '',
      '--primary': css?.general?.['primary-color'] ?? '',
      '--box-shadow': css?.general?.['box-shadow'] ?? '',
      '--primary-btn-bg': css?.general?.['primary-buttons']?.background ?? '',
      '--primary-btn-color': css?.general?.['primary-buttons']?.color ?? '',
      '--secondary-btn-bg': css?.general?.['secondary-buttons']?.background ?? '',
      '--secondary-btn-color': css?.general?.['secondary-buttons']?.color ?? '',
      '--state-bg': css?.general?.['activeAndHoverElements']?.background ?? '',
      '--state-color': css?.general?.['activeAndHoverElements']?.color ?? '',
      '--warning-btn-bg': css?.confirmationModal?.['confirm-button']?.background ?? '',
      '--warning-btn-color': css?.confirmationModal?.['confirm-button']?.color ?? '',
    };
    
  }

  /**
   * 
   * getConf() {
    this.http
      .get(`https://api.ubiqq.com/live/1.1/room/ubiqq`)
      .subscribe((conf) => {
        console.log(conf);
      }, (error) => {
        console.error('Error:', error);
      });
  }
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] && changes['config'].currentValue) {
      this.getAttributeConf();
    }
  }
  

  showSelectedModule(module: any) {
    this.componentToShow.component = module.key;
    this.componentToShow.componentName = module.value.label;
    this.cdr.detectChanges();

    localStorage.setItem(
      'componentToShow',
      JSON.stringify(this.componentToShow)
    );

    if (this.checkIfMobile()) {
      this.isShowMobileMenu = false;
    }
  }




  checkIfMobile() {
    return window.innerWidth <= 1000;
  }

  openMobileMenu() {
    this.isShowMobileMenu = !this.isShowMobileMenu;
  }

  showSidebarInChild() {
    this.aiChatComponent.showSidebar();
    this.isShowSidebar = this.aiChatComponent.isShowSidebar;
  }
}
