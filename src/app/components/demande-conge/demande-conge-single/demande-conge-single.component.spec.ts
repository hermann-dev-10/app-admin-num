import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeCongeSingleComponent } from './demande-conge-single.component';

describe('DemandeCongeSingleComponent', () => {
  let component: DemandeCongeSingleComponent;
  let fixture: ComponentFixture<DemandeCongeSingleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemandeCongeSingleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemandeCongeSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
