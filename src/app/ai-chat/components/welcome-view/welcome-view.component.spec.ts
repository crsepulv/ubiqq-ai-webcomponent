import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeViewComponent } from './welcome-view.component';

describe('WelcomeViewComponent', () => {
  let component: WelcomeViewComponent;
  let fixture: ComponentFixture<WelcomeViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WelcomeViewComponent]
    });
    fixture = TestBed.createComponent(WelcomeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debría crearse', () => {
    expect(component).toBeTruthy();
  });
});
