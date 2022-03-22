import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumeriseurComponent } from './numeriseur.component';

describe('NumeriseurComponent', () => {
  let component: NumeriseurComponent;
  let fixture: ComponentFixture<NumeriseurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NumeriseurComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NumeriseurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
