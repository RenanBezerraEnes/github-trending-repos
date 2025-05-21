import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RepoCardComponent } from './repo-card.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RatingService } from '@core/services/rating-service/rating.service';
import { Repo } from '@core/models/repo.model';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { signal } from '@angular/core';
import { Component } from '@angular/core';
import { PageListService } from '@core/services/page-list-service/page-list.service';
import { RepoModalComponent } from '../repo-modal/repo-modal.component';

const mockRepo: Repo = {
  id: 101,
  name: 'angular-awesome',
  full_name: 'me/angular-awesome',
  html_url: 'https://github.com/me/angular-awesome',
  description: 'An awesome Angular library',
  stargazers_count: 120,
  open_issues_count: 5,
  created_at: '2024-11-01T10:15:30Z',
  owner: { login: 'me', avatar_url: 'https://avatars.githubusercontent.com/u/123?v=4' },
};

@Component({
  selector: 'app-repo-modal',
  template: '',
  standalone: true,
})
class MockRepoModalComponent {
  data = { ...mockRepo, rating: 0 };
  dialogRef = { close: jasmine.createSpy('close') };
  currentRating = signal(0);

  rate(value: number) {
    this.currentRating.set(value);
  }

  close() {
    this.dialogRef.close(this.currentRating());
  }
}

describe('RepoCardComponent', () => {
  let component: RepoCardComponent;
  let fixture: ComponentFixture<RepoCardComponent>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let ratingServiceSpy: jasmine.SpyObj<RatingService>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<MockRepoModalComponent>>;
  let pageListServiceSpy: jasmine.SpyObj<PageListService>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    ratingServiceSpy = jasmine.createSpyObj('RatingService', ['getRating', 'setRating']);
    pageListServiceSpy = jasmine.createSpyObj('PageListService', ['loadPage'], {
      state: {
        repos: signal([mockRepo]),
        status: signal('Success'),
        error: signal(null),
      },
    });

    await TestBed.configureTestingModule({
      imports: [RepoCardComponent, RepoModalComponent],
      providers: [
        { provide: MatDialog, useValue: dialogSpy },
        { provide: RatingService, useValue: ratingServiceSpy },
        { provide: PageListService, useValue: pageListServiceSpy },
        { provide: MAT_DIALOG_DATA, useValue: { ...mockRepo, rating: 0 } },
        { provide: MatDialogRef, useValue: dialogRefSpy },
      ],
    })
      .overrideComponent(RepoCardComponent, {
        set: {
          imports: [CommonModule, MatCardModule, MatIconModule, MatChipsModule],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(RepoCardComponent);
    component = fixture.componentInstance;
    Object.defineProperty(component, 'repo', {
      get: () => signal(mockRepo),
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set repo input signal', () => {
    fixture.detectChanges();
    expect(component.repo()).toEqual(mockRepo);
  });

  it('should compute rating from service', () => {
    const mockRating = 4;
    ratingServiceSpy.getRating.and.returnValue(mockRating);
    fixture.detectChanges();
    expect(component.rating()).toBe(mockRating);
    expect(ratingServiceSpy.getRating).toHaveBeenCalledWith(mockRepo.id);
  });

  it('should open modal with correct data', () => {
    const mockRating = 3;
    ratingServiceSpy.getRating.and.returnValue(mockRating);
    dialogSpy.open.and.returnValue(dialogRefSpy);
    fixture.detectChanges();

    component.openModal();

    expect(dialogSpy.open).toHaveBeenCalledWith(jasmine.any(Function), {
      data: {
        ...mockRepo,
        rating: mockRating,
      },
    });
  });

  it('should render repo details correctly', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.repo-name').textContent).toContain(mockRepo.full_name);
    expect(compiled.querySelector('.repo-owner').textContent).toContain(mockRepo.owner.login);
    expect(compiled.querySelector('.description').textContent.trim()).toBe(mockRepo.description);
    expect(compiled.querySelector('.stats').textContent).toContain(
      mockRepo.stargazers_count.toString(),
    );
    expect(compiled.querySelector('.stats').textContent).toContain(
      mockRepo.open_issues_count.toString(),
    );
  });

  it('should show "No description available" when description is null', () => {
    const repoWithoutDescription = { ...mockRepo, description: null };
    Object.defineProperty(component, 'repo', {
      get: () => signal(repoWithoutDescription),
    });
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.description').textContent.trim()).toBe(
      'No description available',
    );
  });
});
