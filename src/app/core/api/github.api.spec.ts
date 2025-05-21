/* github.api.spec.ts */
import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { GithubApi } from './github.api';
import { Repo } from '@core/models/repo.model';

describe('GithubApi', () => {
  let api: GithubApi;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GithubApi, provideHttpClient(), provideHttpClientTesting()],
    });

    api = TestBed.inject(GithubApi);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(api).toBeTruthy();
  });

  it('should fetch trending repos with correct parameters', () => {
    const mockRepos: Repo[] = [
      {
        id: 1,
        name: 'test-repo',
        full_name: 'user/test-repo',
        html_url: 'https://github.com/user/test-repo',
        description: 'Test repository',
        stargazers_count: 100,
        open_issues_count: 5,
        created_at: '2024-01-01T00:00:00Z',
        owner: {
          login: 'user',
          avatar_url: 'https://github.com/avatar.png',
        },
      },
    ];

    const mockResponse = {
      items: mockRepos,
      total_count: 1,
    };

    api.getTrendingRepos(1).subscribe((repos) => {
      expect(repos).toEqual(mockRepos);
    });

    const req = httpTestingController.expectOne((request) => {
      return (
        request.url === 'https://api.github.com/search/repositories' &&
        request.params.has('q') &&
        request.params.has('sort') &&
        request.params.has('order') &&
        request.params.has('page') &&
        request.params.has('per_page')
      );
    });

    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('sort')).toBe('stars');
    expect(req.request.params.get('order')).toBe('desc');
    expect(req.request.params.get('page')).toBe('1');
    expect(req.request.params.get('per_page')).toBe('100');

    req.flush(mockResponse);
  });

  it('should handle API errors gracefully', () => {
    const errorMessage = 'Error fetching trending repos';

    api.getTrendingRepos(1).subscribe({
      error: (error) => {
        expect(error.message).toBe(errorMessage);
      },
    });

    const req = httpTestingController.expectOne((request) => {
      return (
        request.url === 'https://api.github.com/search/repositories' &&
        request.params.has('q') &&
        request.params.has('sort') &&
        request.params.has('order') &&
        request.params.has('page') &&
        request.params.has('per_page')
      );
    });

    req.error(new ErrorEvent('Network error', { message: errorMessage }));
  });

  it('should use correct date range in query', () => {
    api.getTrendingRepos(1).subscribe();

    const req = httpTestingController.expectOne((request) => {
      return (
        request.url === 'https://api.github.com/search/repositories' &&
        request.params.has('q') &&
        request.params.has('sort') &&
        request.params.has('order') &&
        request.params.has('page') &&
        request.params.has('per_page')
      );
    });

    const query = req.request.params.get('q');
    expect(query).toMatch(/^created:>\d{4}-\d{2}-\d{2}$/);

    req.flush({ items: [], total_count: 0 });
  });
});
