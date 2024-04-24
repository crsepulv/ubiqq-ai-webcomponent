import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LoaderComponent } from './loader.component';

describe('LoaderComponent', () => {
  let component: LoaderComponent;
  let fixture: ComponentFixture<LoaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoaderComponent],
    });
    fixture = TestBed.createComponent(LoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debería mostrar el texto de carga predeterminado si no se proporciona un texto personalizado', () => {
    const loaderText = fixture.debugElement.query(By.css('.ai-loader_loading-text')).nativeElement.textContent.trim();
    expect(loaderText).toEqual('Cargando');
  });

  it('debería mostrar el texto de carga personalizado si se proporciona', () => {
    const customLoaderText = 'Personalizado';
    component.loaderText = customLoaderText;
    fixture.detectChanges();

    const loaderText = fixture.debugElement.query(By.css('.ai-loader_loading-text')).nativeElement.textContent.trim();
    expect(loaderText).toEqual(customLoaderText);
  });
});
