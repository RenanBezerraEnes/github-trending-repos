import { TestBed } from '@angular/core/testing';

import { PageListService } from './page-list.service';

describe('PageListService', () => {
  let service: PageListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PageListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
