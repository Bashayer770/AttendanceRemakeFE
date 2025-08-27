import { Routes } from '@angular/router';
import { LocationComponent } from './features/locations/locations.component';
import { HomeComponent } from './features/Home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'locations', component: LocationComponent },
];
