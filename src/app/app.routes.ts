import { Routes } from '@angular/router';
import { InstoreAiComponent } from './features/installation/components/instore-ai.component';
import { SecondPageComponent } from './features/installation/components/second_page/second-page.component';
import { SurveyEnd } from './features/installation/components/survey-end/survey-end';

export const routes: Routes = [
  { path: '', component: InstoreAiComponent },
  { path: 'second-page', component: SecondPageComponent },
  { path: 'third-page', component: SurveyEnd },
];
