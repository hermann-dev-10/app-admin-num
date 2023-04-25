import { TestBed } from '@angular/core/testing';

import { ClasseurService } from './classeur.service';

describe('ClasseurService', () => {
  let service: ClasseurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClasseurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
