import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepoModalComponent } from './repo-modal.component';

describe('RepoModalComponent', () => {
  let component: RepoModalComponent;
  let fixture: ComponentFixture<RepoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepoModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
