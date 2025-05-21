import { Component, inject, signal } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { RatingService } from '@core/services/rating-service/rating.service';
@Component({
  selector: 'app-repo-modal',
  imports: [CommonModule, MatDialogModule, MatIconModule, MatButtonModule, MatChipsModule],
  templateUrl: './repo-modal.component.html',
  styleUrl: './repo-modal.component.scss',
})
export class RepoModalComponent {
  private readonly ratingService = inject(RatingService);
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<RepoModalComponent>);

  currentRating = signal(this.ratingService.getRating(this.data.id) || this.data.rating);

  rate(value: number) {
    this.currentRating.set(value);
  }

  close() {
    this.ratingService.setRating(this.data.id, this.currentRating());
    this.dialogRef.close(this.currentRating());
  }
}
