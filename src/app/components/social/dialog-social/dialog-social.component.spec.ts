import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSocialComponent } from './dialog-social.component';

describe('DialogSocialComponent', () => {
  let component: DialogSocialComponent;
  let fixture: ComponentFixture<DialogSocialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogSocialComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogSocialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
