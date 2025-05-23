import { Component, computed, inject, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Repo } from '@core/models/repo.model';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { RepoModalComponent } from '@shared/components/repo-modal/repo-modal.component';
import { RatingService } from '@core/services/rating-service/rating.service';
@Component({
  selector: 'app-repo-card',
  imports: [CommonModule, MatCardModule, MatIconModule, MatChipsModule],
  templateUrl: './repo-card.component.html',
  styleUrl: './repo-card.component.scss',
})
export class RepoCardComponent {
  private readonly dialog = inject(MatDialog);
  private readonly ratingService = inject(RatingService);
  repo = input.required<Repo>();

  rating = computed(() => this.ratingService.getRating(this.repo().id));

  openModal() {
    const w = window.innerWidth;

    const width = `${Math.min(w * 0.98, 600)}px`;
    const maxHeight = `calc(100vh - 16px)`;

    this.dialog.open(RepoModalComponent, {
      data: { ...this.repo(), rating: this.rating() },
      width,
      maxHeight,
      position: { top: '8px' },
    });
  }
}
