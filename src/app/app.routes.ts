import { Routes } from '@angular/router';
import { InstoreAiComponent } from './features/installation/components/instore-ai.component';
import { SecondPageComponent } from './features/installation/components/second_page/second-page.component';
import { SurveyEnd } from './features/installation/components/survey-end/survey-end';
import { PropaneFormComponent } from './features/installation/components/Propane_form/propane-form.component';

export const routes: Routes = [
  { path: '', component: InstoreAiComponent },
  { path: 'second-page', component: SecondPageComponent },
  { path: 'third-page', component: SurveyEnd },
  { path: 'propane-document', component: PropaneFormComponent },
];
