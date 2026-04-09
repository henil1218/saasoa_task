import { Routes } from '@angular/router';
import { InstoreAiComponent } from './features/installation/components/instore-ai.component';
import { SecondPageComponent } from './features/installation/components/second_page/second-page.component';

export const routes: Routes = [
  { path: '', component: InstoreAiComponent },
  { path: 'second-page', component: SecondPageComponent },
];
