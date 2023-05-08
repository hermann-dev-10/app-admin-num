import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDemandeCongeComponent } from './dialog-demande-conge.component';

describe('DialogDemandeCongeComponent', () => {
  let component: DialogDemandeCongeComponent;
  let fixture: ComponentFixture<DialogDemandeCongeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDemandeCongeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogDemandeCongeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
