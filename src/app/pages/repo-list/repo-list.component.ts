import { Component, effect, inject } from '@angular/core';
import { PageListService } from '@services/page-list.service';

@Component({
  selector: 'app-repo-list',
  imports: [],
  templateUrl: './repo-list.component.html',
  styleUrl: './repo-list.component.scss',
})
export class RepoListComponent {
  private readonly pageListService = inject(PageListService);

  public readonly data = this.pageListService.state.repos;

  constructor() {
    effect(() => {
      console.log('Repos loaded:', this.data());
    });
  }
}
