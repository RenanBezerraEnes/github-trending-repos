import { TestBed } from '@angular/core/testing';

import { GithubApi } from './github.api';

describe('GithubApi', () => {
  let service: GithubApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GithubApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
