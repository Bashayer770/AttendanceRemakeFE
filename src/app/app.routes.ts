import { Routes } from '@angular/router';
import { LocationComponent } from './features/locations/locations.component';
// import { HomeComponent } from './features/user/user.component';
import { NodesComponent } from './features/nodes/nodes.component';
import { UserComponent } from './features/user/user.component';
import { UsersSearchComponent } from './features/users/users-search.component';

export const routes: Routes = [
  // { path: '', component: HomeComponent },
  { path: 'locations', component: LocationComponent },
  { path: 'nodes', component: NodesComponent },
  { path: 'employees/info', component: UserComponent },
  { path: 'users', component: UsersSearchComponent },
];
