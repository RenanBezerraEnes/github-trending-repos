import { TestBed } from '@angular/core/testing';
import { PageListService } from './page-list.service';
import { GithubApi } from '@core/api/github.api';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { Repo } from '@core/models/repo.model';

describe('PageListService', () => {
  let service: PageListService;
  let githubApiSpy: jasmine.SpyObj<GithubApi>;

  const mockRepos: Repo[] = [
    {
      id: 1,
      name: 'test-repo',
      full_name: 'user/test-repo',
      html_url: 'https://github.com/user/test-repo',
      description: 'desc',
      stargazers_count: 100,
      open_issues_count: 5,
      created_at: new Date().toISOString(),
      owner: {
        login: 'user',
        avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
      },
    },
  ];

  beforeEach(() => {
    githubApiSpy = jasmine.createSpyObj('GithubApi', ['getTrendingRepos']);
    githubApiSpy.getTrendingRepos.and.returnValue(of([]));

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: GithubApi, useValue: githubApiSpy },
      ],
    });

    service = TestBed.inject(PageListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not call API again for already loaded page', () => {
    githubApiSpy.getTrendingRepos.calls.reset();

    service.loadPage(2);
    service.loadPage(2);

    expect(githubApiSpy.getTrendingRepos).toHaveBeenCalledTimes(1);
    expect(githubApiSpy.getTrendingRepos).toHaveBeenCalledWith(2);
  });

  it('should not load the same data twice', () => {
    githubApiSpy.getTrendingRepos.and.returnValue(of(mockRepos));
    expect(githubApiSpy.getTrendingRepos).toHaveBeenCalledTimes(1);
  });

  it('load more than one repo', () => {
    const page1Repos = [{ ...mockRepos[0], id: 1 }];
    const page2Repos = [{ ...mockRepos[0], id: 2 }];
    githubApiSpy.getTrendingRepos.and.callFake((page: number) => {
      return of(page === 1 ? page1Repos : page2Repos);
    });

    service.loadPage(1);
    service.loadPage(2);

    expect(service.state.repos()).toEqual([...page1Repos, ...page2Repos]);
  });

  it('should set error signal when API fails', () => {
    const testError = new Error('API failed');
    githubApiSpy.getTrendingRepos.and.returnValue(throwError(() => testError));

    service.loadPage(99);

    expect(service.state.error()).toBe(testError);
  });
});
