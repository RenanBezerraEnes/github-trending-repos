import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Repo } from '@models/repo.model';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-repo-card',
  imports: [CommonModule, MatCardModule, MatIconModule, MatChipsModule],
  templateUrl: './repo-card.component.html',
  styleUrl: './repo-card.component.scss',
})
export class RepoCardComponent {
  repo = input.required<Repo>();
}
