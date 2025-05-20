import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageListService } from '@services/page-list.service';
import { RepoCardComponent } from '@components/repo-card/repo-card.component';
@Component({
  selector: 'app-repo-list',
  imports: [CommonModule, RepoCardComponent],
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
