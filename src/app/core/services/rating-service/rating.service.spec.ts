import { TestBed } from '@angular/core/testing';
import { RatingService } from './rating.service';

describe('RatingService', () => {
  let service: RatingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RatingService],
    });

    service = TestBed.inject(RatingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return 0 for a repo with no rating', () => {
    expect(service.getRating(123)).toBe(0);
  });

  it('should store and retrieve a rating correctly', () => {
    service.setRating(123, 4);
    expect(service.getRating(123)).toBe(4);
  });

  it('should update an existing rating', () => {
    service.setRating(123, 2);
    service.setRating(123, 5);
    expect(service.getRating(123)).toBe(5);
  });

  it('should reflect the ratings map correctly in the signal', () => {
    service.setRating(101, 3);
    service.setRating(202, 5);

    const ratings = service.ratings();
    expect(ratings[101]).toBe(3);
    expect(ratings[202]).toBe(5);
    expect(Object.keys(ratings).length).toBe(2);
  });
});
