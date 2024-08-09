import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { AiChatComponent } from '../ai-chat/ai-chat.component';
import { ComponentToShow } from './types';
import { ConfService } from '../conf/conf.service';

type Styles = {
  main: any;
  header: any;
};

@Component({
  selector: 'app-ai-components-layout',
  templateUrl: './ai-components-layout.component.html',
  styleUrls: ['./ai-components-layout.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class AiComponentsLayoutComponent implements OnInit {
  @Input() userid: string = 'userid';
  @Input() config!: string;

  conf: any;

  private flattenStyles(styles: any): any {
    const flattenedStyles = {};

    for (const key in styles) {
      if (styles.hasOwnProperty(key)) {
        Object.assign(flattenedStyles, styles[key]);
      }
    }

    return flattenedStyles;
  }
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
    public confService: ConfService
  ) {}

  iterateObjectKeysAndValues(obj: any): { key: string; value: any }[] {
    return Object.entries({ ...obj }).map(([key, value]) => ({ key, value }));
  }

  ngOnInit(): void {
    if (this.config) {
      const decodedString = atob(this.config); // Decodificar Base64
      this.conf = JSON.parse(decodedString); // Convertir el string en JSON
      this.conf.styles = this.flattenStyles(this.conf.styles); // Aplicar la función flattenStyles
      this.confService.conf.next(this.conf);
      console.log(this.confService.conf.value);

      if(this.conf.navbar){
        this.modules = {
          'ai-chat': {
            label: this.conf.navbar.chat,
          },
          'ai-file-transcriptor': {
            label: this.conf.navbar.transcriptor,
          },
          'ai-pdf-file-handler': {
            label: this.conf.navbar['pdf-conversor'],
          },
        };
      }
    }

    const savedShowDefaultComponent = localStorage.getItem('componentToShow');

    if (savedShowDefaultComponent !== null) {
      this.componentToShow = JSON.parse(savedShowDefaultComponent);

      if (!this.componentToShow.component) {
        localStorage.removeItem('showDefaultComponent');
      }
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
