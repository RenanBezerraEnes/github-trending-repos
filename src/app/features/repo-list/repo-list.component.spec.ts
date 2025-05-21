/* eslint-disable @angular-eslint/directive-selector */
import { Component, Directive, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RepoListComponent } from './repo-list.component';
import { PageListService } from '@core/services/page-list-service/page-list.service';
import { Repo } from '@core/models/repo.model';
import { LoadingState } from '@core/models/loading-state.enum';

const fakeRepos: Repo[] = [
  {
    id: 101,
    name: 'angular-awesome',
    full_name: 'me/angular-awesome',
    html_url: 'https://github.com/me/angular-awesome',
    description: 'An awesome Angular library',
    stargazers_count: 120,
    open_issues_count: 5,
    created_at: '2024-11-01T10:15:30Z',
    owner: { login: 'me', avatar_url: 'https://avatars.githubusercontent.com/u/123?v=4' },
  },
  {
    id: 202,
    name: 'repo-list-demo',
    full_name: 'me/repo-list-demo',
    html_url: 'https://github.com/me/repo-list-demo',
    description: null,
    stargazers_count: 8,
    open_issues_count: 0,
    created_at: '2025-02-14T18:45:00Z',
    owner: { login: 'me', avatar_url: 'https://avatars.githubusercontent.com/u/123?v=4' },
  },
  {
    id: 303,
    name: 'infinite-scroll-test',
    full_name: 'me/infinite-scroll-test',
    html_url: 'https://github.com/me/infinite-scroll-test',
    description: 'Demo for infinite scrolling',
    stargazers_count: 42,
    open_issues_count: 2,
    created_at: '2023-07-22T08:00:00Z',
    owner: { login: 'me', avatar_url: 'https://avatars.githubusercontent.com/u/123?v=4' },
  },
];

@Component({
  standalone: true,
  selector: 'app-repo-card',
  template: '',
})
class StubRepoCardComponent {
  repo = input.required<Repo>();
}

@Directive({
  standalone: true,
  selector: '[infiniteScroll]',
})
class StubInfiniteScrollDirective {
  infiniteScrollDistance = input.required<number>();
  infiniteScrollThrottle = input.required<number>();
  scrolled = output<void>();
}

describe('RepoListComponent', () => {
  let fixture: ComponentFixture<RepoListComponent>;
  let component: RepoListComponent;
  let pageListSpy: jasmine.SpyObj<PageListService>;

  beforeEach(() => {
    pageListSpy = jasmine.createSpyObj<PageListService>('PageListService', ['loadPage'], {
      state: {
        repos: signal(fakeRepos),
        status: signal(LoadingState.Success),
        error: signal(null),
      },
    });
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RepoListComponent,
        StubRepoCardComponent,
        StubInfiniteScrollDirective,
      ],
      providers: [{ provide: PageListService, useValue: pageListSpy }],
    }).compileComponents();

    TestBed.overrideComponent(RepoListComponent, {
      set: {
        imports: [CommonModule, StubRepoCardComponent, StubInfiniteScrollDirective],
      },
    });

    fixture = TestBed.createComponent(RepoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('starts with currentPage = 1', () => {
    expect((component as unknown as { currentPage: number }).currentPage).toBe(1);
  });

  it('binds data() to the repos signal', () => {
    expect(component.data()).toEqual(fakeRepos);
  });

  describe('loadNextPage()', () => {
    it('increments page and calls loadPage when not Pending', () => {
      component.loadNextPage();
      expect((component as unknown as { currentPage: number }).currentPage).toBe(2);
      expect(pageListSpy.loadPage).toHaveBeenCalledWith(2);
    });

    it('does nothing if status() is Pending', () => {
      Object.defineProperty(pageListSpy.state, 'status', {
        get: () => signal(LoadingState.Pending),
      });
      component.loadNextPage();
      expect((component as unknown as { currentPage: number }).currentPage).toBe(1);
      expect(pageListSpy.loadPage).not.toHaveBeenCalled();
    });
  });

  it('renders one <app-repo-card> per repo', () => {
    const cards = fixture.nativeElement.querySelectorAll('app-repo-card');
    expect(cards.length).toBe(fakeRepos.length);
  });

  it('passes the correct repo into each card', () => {
    const cardEls = fixture.debugElement.queryAll(By.directive(StubRepoCardComponent));
    expect(cardEls.length).toBe(fakeRepos.length);
    cardEls.forEach((de, i) => {
      expect((de.componentInstance as StubRepoCardComponent).repo()).toEqual(fakeRepos[i]);
    });
  });

  it('calls loadNextPage() when infinite-scroll emits', () => {
    spyOn(component, 'loadNextPage');
    const dirEl = fixture.debugElement.query(By.directive(StubInfiniteScrollDirective));
    const dir = dirEl.injector.get(StubInfiniteScrollDirective);
    dir.scrolled.emit();
    expect(component.loadNextPage).toHaveBeenCalled();
  });

  it('sets the correct infiniteScroll inputs', () => {
    const dirEl = fixture.debugElement.query(By.directive(StubInfiniteScrollDirective));
    const dir = dirEl.injector.get(StubInfiniteScrollDirective);
    expect(dir.infiniteScrollDistance()).toBe(2);
    expect(dir.infiniteScrollThrottle()).toBe(150);
  });
});
