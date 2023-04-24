import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFolderComponent } from './admin-folder.component';

describe('AdminFolderComponent', () => {
  let component: AdminFolderComponent;
  let fixture: ComponentFixture<AdminFolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminFolderComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
