import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeCongeCreationComponent } from './demande-conge-creation.component';

describe('DemandeCongeCreationComponent', () => {
  let component: DemandeCongeCreationComponent;
  let fixture: ComponentFixture<DemandeCongeCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemandeCongeCreationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemandeCongeCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
