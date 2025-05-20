import { inject, Injectable, Signal } from '@angular/core';
import { Repo } from '@models/repo.model';
import { LoadingState } from '@models/loading-state.enum';
import { catchError, map, merge, of, shareReplay, startWith, Subject, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { ServiceState } from '@models/service-state.interface';
import { GithubApi } from '@api/github.api';

interface GithubRepoState extends ServiceState {
  repos: Signal<Repo[]>;
  status: Signal<LoadingState>;
  error: Signal<Error | null>;
}

@Injectable({
  providedIn: 'root',
})
export class PageListService {
  private readonly githubApi = inject(GithubApi);

  private readonly error$ = new Subject<Error | null>();
  private readonly loadPage$ = new Subject<number>();

  private readonly repos$ = this.loadPage$.pipe(
    startWith(1),
    switchMap((page) =>
      this.githubApi.getTrendingRepos(page).pipe(
        catchError((error) => {
          this.error$.next(error);
          return of([]);
        }),
      ),
    ),
    shareReplay(1),
  );

  private readonly status$ = merge(
    this.repos$.pipe(map(() => LoadingState.Success)),
    this.error$.pipe(map(() => LoadingState.Error)),
    this.loadPage$.pipe(map(() => LoadingState.Pending)),
  );

  private readonly repos = toSignal(this.repos$, { initialValue: [] });
  private readonly status = toSignal(this.status$, { initialValue: LoadingState.Pending });
  private readonly error = toSignal(this.error$, { initialValue: null });

  public state: GithubRepoState = {
    repos: this.repos,
    status: this.status,
    error: this.error,
  };
}
