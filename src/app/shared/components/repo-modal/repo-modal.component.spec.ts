import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RepoModalComponent } from './repo-modal.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RatingService } from '@core/services/rating-service/rating.service';

const mockRepo = {
  id: 101,
  name: 'angular-awesome',
  full_name: 'me/angular-awesome',
  html_url: 'https://github.com/me/angular-awesome',
  description: 'An awesome Angular library',
  stargazers_count: 120,
  open_issues_count: 5,
  created_at: '2024-11-01T10:15:30Z',
  owner: { login: 'me', avatar_url: 'https://avatars.githubusercontent.com/u/123?v=4' },
  rating: 0,
};

describe('RepoModalComponent', () => {
  let component: RepoModalComponent;
  let fixture: ComponentFixture<RepoModalComponent>;
  let ratingServiceSpy: jasmine.SpyObj<RatingService>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<RepoModalComponent>>;

  beforeEach(async () => {
    ratingServiceSpy = jasmine.createSpyObj('RatingService', ['getRating', 'setRating']);
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [RepoModalComponent],
      providers: [
        { provide: RatingService, useValue: ratingServiceSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockRepo },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RepoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with rating from service or data', () => {
    const mockRating = 4;
    ratingServiceSpy.getRating.and.returnValue(mockRating);
    fixture = TestBed.createComponent(RepoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.currentRating()).toBe(mockRating);
  });

  it('should update rating when rate is called', () => {
    const newRating = 3;
    component.rate(newRating);
    expect(component.currentRating()).toBe(newRating);
  });

  it('should save rating and close dialog when close is called', () => {
    const finalRating = 5;
    component.rate(finalRating);
    component.close();
    expect(ratingServiceSpy.setRating).toHaveBeenCalledWith(mockRepo.id, finalRating);
    expect(dialogRefSpy.close).toHaveBeenCalledWith(finalRating);
  });

  it('should render repo details correctly', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h2').textContent).toContain(mockRepo.full_name);
    expect(compiled.querySelector('.avatar').src).toContain(mockRepo.owner.avatar_url);
    expect(compiled.querySelector('.avatar').alt).toBe(mockRepo.owner.login);
    expect(compiled.querySelector('p').textContent).toContain(mockRepo.description);
    expect(compiled.querySelector('.stats').textContent).toContain(
      mockRepo.stargazers_count.toString(),
    );
    expect(compiled.querySelector('.stats').textContent).toContain(
      mockRepo.open_issues_count.toString(),
    );
  });

  it('should show "No description" when description is null', () => {
    const repoWithoutDescription = { ...mockRepo, description: null };
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [RepoModalComponent],
      providers: [
        { provide: RatingService, useValue: ratingServiceSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: repoWithoutDescription },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RepoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('p').textContent).toContain('No description');
  });

  it('should display correct number of filled stars based on rating', () => {
    const rating = 3;
    component.rate(rating);
    fixture.detectChanges();

    const stars = fixture.nativeElement.querySelectorAll('.star');
    expect(stars.length).toBe(5); // Total stars
    const filledStars = fixture.nativeElement.querySelectorAll('.star.filled');
    expect(filledStars.length).toBe(rating);
  });
});
