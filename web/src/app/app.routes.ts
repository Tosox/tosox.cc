import { Routes } from '@angular/router';
import { About } from './pages/about/about';
import { Contributions } from './pages/contributions/contributions';
import { Projects } from './pages/projects/projects';
import { Skills } from './pages/skills/skills';
import { Work } from './pages/work/work';

export const routes: Routes = [
  { path: '', redirectTo: 'about', pathMatch: 'full' },
  { path: 'about', component: About },
  { path: 'work', component: Work },
  { path: 'projects', component: Projects },
  { path: 'contributions', component: Contributions },
  { path: 'skills', component: Skills },
  { path: '**', redirectTo: 'about' },
];
