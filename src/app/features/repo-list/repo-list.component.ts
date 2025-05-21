import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageListService } from '@core/services/page-list-service/page-list.service';
import { RepoCardComponent } from 'src/app/shared/components/repo-card/repo-card.component';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

@Component({
  selector: 'app-repo-list',
  imports: [CommonModule, RepoCardComponent, InfiniteScrollDirective],
  templateUrl: './repo-list.component.html',
  styleUrl: './repo-list.component.scss',
})
export class RepoListComponent {
  private readonly pageListService = inject(PageListService);
  public readonly data = this.pageListService.state.repos;
  private currentPage = 1;

  loadNextPage() {
    if (this.pageListService.state.status() !== 'Pending') {
      this.currentPage++;
      this.pageListService.loadPage(this.currentPage);
    }
  }
}
