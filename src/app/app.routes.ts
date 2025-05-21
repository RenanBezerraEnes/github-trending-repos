import { Routes } from '@angular/router';
import { RepoListComponent } from '@features/repo-list/repo-list.component';
export const routes: Routes = [
  {
    path: '',
    component: RepoListComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
