import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogGestionDemandeCongeComponent } from './dialog-gestion-demande-conge.component';

describe('DialogGestionDemandeCongeComponent', () => {
  let component: DialogGestionDemandeCongeComponent;
  let fixture: ComponentFixture<DialogGestionDemandeCongeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogGestionDemandeCongeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogGestionDemandeCongeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
