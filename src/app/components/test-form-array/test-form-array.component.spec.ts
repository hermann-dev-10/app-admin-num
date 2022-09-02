import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestFormArrayComponent } from './test-form-array.component';

describe('TestFormArrayComponent', () => {
  let component: TestFormArrayComponent;
  let fixture: ComponentFixture<TestFormArrayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestFormArrayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestFormArrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
