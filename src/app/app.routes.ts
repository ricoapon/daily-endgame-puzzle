import {Routes} from '@angular/router';
import {PuzzleView} from './puzzle-view/puzzle-view';

export const routes: Routes = [
  {path: 'puzzle/:id', component: PuzzleView},
  {path: '', component: PuzzleView},
  {path: '**', redirectTo: ''},
];
