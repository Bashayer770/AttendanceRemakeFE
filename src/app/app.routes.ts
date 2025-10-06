import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { NodesComponent } from './features/nodes/nodes.component';
import { LocationComponent } from './features/locations/locations.component';
import { UsersSearchComponent } from './features/users/users-search.component';
import { DepartmentsComponent } from './features/departments/departments.component';

export const routes: Routes = [
  { path: '', component: NodesComponent },
  { path: 'nodes', component: NodesComponent },
  { path: 'locations', component: LocationComponent },
  { path: 'users', component: UsersSearchComponent },
  { path: 'departments', component: DepartmentsComponent },
];
