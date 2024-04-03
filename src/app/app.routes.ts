import { Routes } from '@angular/router';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { HomeComponent } from './home/home.component';
import { IntencjeComponent } from './intencje/intencje.component';
import { OgloszeniaComponent } from './ogloszenia/ogloszenia.component';
import { GaleriaComponent } from './galeria/galeria.component';
import { NabozenstwaComponent } from './nabozenstwa/nabozenstwa.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'admin', component: AdminPanelComponent },
  { path: 'intencje/:date', component: IntencjeComponent },
  { path: 'ogloszenia/:date', component: OgloszeniaComponent },
  { path: 'galeria', component: GaleriaComponent },
  { path: 'nabozenstwa', component: NabozenstwaComponent },
  { path: '**', redirectTo: '' },
];
