import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDemandeCongeComponent } from './edit-demande-conge.component';

describe('EditDemandeCongeComponent', () => {
  let component: EditDemandeCongeComponent;
  let fixture: ComponentFixture<EditDemandeCongeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDemandeCongeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDemandeCongeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
