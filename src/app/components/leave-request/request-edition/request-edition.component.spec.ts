import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestEditionComponent } from './request-edition.component';

describe('RequestEditionComponent', () => {
  let component: RequestEditionComponent;
  let fixture: ComponentFixture<RequestEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestEditionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
