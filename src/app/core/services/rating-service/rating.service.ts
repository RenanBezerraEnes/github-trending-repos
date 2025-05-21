import { Injectable, Signal, computed, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RatingService {
  private ratingsMap = signal<Record<string, number>>({});

  ratings: Signal<Record<string, number>> = computed(() => this.ratingsMap());

  getRating(id: number): number {
    return this.ratingsMap()[id] ?? 0;
  }

  setRating(id: number, rating: number) {
    this.ratingsMap.update((prev) => ({ ...prev, [id]: rating }));
  }
}
