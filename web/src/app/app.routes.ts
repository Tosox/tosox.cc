import { Routes } from '@angular/router';
import { About } from './pages/about/about';
import { Contributions } from './pages/contributions/contributions';
import { NotFound } from './pages/not-found/not-found';
import { Privacy } from './pages/privacy/privacy';
import { Projects } from './pages/projects/projects';
import { Skills } from './pages/skills/skills';
import { Work } from './pages/work/work';

export const routes: Routes = [
  { path: '', component: About },
  { path: 'work', component: Work },
  { path: 'projects', component: Projects },
  { path: 'contributions', component: Contributions },
  { path: 'skills', component: Skills },
  { path: 'privacy', component: Privacy },
  { path: '**', component: NotFound },
];
