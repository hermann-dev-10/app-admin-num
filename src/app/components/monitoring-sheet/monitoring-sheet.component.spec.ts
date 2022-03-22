import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringSheetComponent } from './monitoring-sheet.component';

describe('MonitoringSheetComponent', () => {
  let component: MonitoringSheetComponent;
  let fixture: ComponentFixture<MonitoringSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitoringSheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
