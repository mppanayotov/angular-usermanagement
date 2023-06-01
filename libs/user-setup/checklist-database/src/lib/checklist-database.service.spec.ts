import { TestBed } from '@angular/core/testing';

import { UserSetupChecklistDatabaseService } from './checklist-database.service';

describe('UserSetupChecklistDatabaseService', () => {
  let service: UserSetupChecklistDatabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserSetupChecklistDatabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
