import { TestBed } from '@angular/core/testing';

import { ChecklistTreeService } from './checklist-tree.service';

describe('ChecklistTreeService', () => {
  let service: ChecklistTreeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChecklistTreeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
