import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleSocialComponent } from './single-social.component';

describe('SingleSocialComponent', () => {
  let component: SingleSocialComponent;
  let fixture: ComponentFixture<SingleSocialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleSocialComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleSocialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
