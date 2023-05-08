import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDemandeCongeComponent } from './admin-demande-conge.component';

describe('AdminDemandeCongeComponent', () => {
  let component: AdminDemandeCongeComponent;
  let fixture: ComponentFixture<AdminDemandeCongeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDemandeCongeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDemandeCongeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
