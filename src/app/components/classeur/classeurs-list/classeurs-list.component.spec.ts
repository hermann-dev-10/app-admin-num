import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClasseursListComponent } from './classeurs-list.component';

describe('ClasseurListComponent', () => {
  let component: ClasseursListComponent;
  let fixture: ComponentFixture<ClasseursListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClasseursListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClasseursListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
