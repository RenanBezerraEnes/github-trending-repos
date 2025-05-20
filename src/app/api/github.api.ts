import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, catchError, throwError } from 'rxjs';
import { Repo } from '../models/repo.model';

@Injectable({
  providedIn: 'root',
})
export class GithubApi {
  private readonly httpClient = inject(HttpClient);
  private readonly baseUrl = 'https://api.github.com/search/repositories';

  private readonly baseDate = new Date('2021-02-01');

  private readonly startDate = new Date(this.baseDate.getTime() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  getTrendingRepos(page: number): Observable<Repo[]> {
    const params = new HttpParams()
      .set('q', `created:>${this.startDate}`)
      .set('sort', 'stars')
      .set('order', 'desc')
      .set('page', page.toString())
      .set('per_page', '100');

    return this.httpClient
      .get<{ items: Repo[]; total_count: number }>(this.baseUrl, { params })
      .pipe(
        map((res) => res.items),
        catchError((error) => {
          console.error('Error fetching trending repos:', error);
          return throwError(() => new Error('Error fetching trending repos'));
        }),
      );
  }
}
