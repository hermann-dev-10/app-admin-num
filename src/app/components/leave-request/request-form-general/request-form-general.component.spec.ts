import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestFormGeneralComponent } from './request-form-general.component';

describe('RequestFormGeneralComponent', () => {
  let component: RequestFormGeneralComponent;
  let fixture: ComponentFixture<RequestFormGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestFormGeneralComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestFormGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
