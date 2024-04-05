import { Routes } from '@angular/router';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { HomeComponent } from './home/home.component';
import { IntencjeComponent } from './intencje/intencje.component';
import { OgloszeniaComponent } from './ogloszenia/ogloszenia.component';
import { GaleriaComponent } from './galeria/galeria.component';
import { NabozenstwaComponent } from './nabozenstwa/nabozenstwa.component';
import { FolderComponent } from './galeria/folder/folder.component';
import { OgloszeniaWybraneComponent } from './ogloszenia/ogloszenia.wybrane/ogloszenia.wybrane.component';
import { IntencjeWybraneComponent } from './intencje/intencje.wybrane/intencje.wybrane.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'admin', component: AdminPanelComponent },
  { path: 'intencje', component: IntencjeComponent },
  { path: 'intencje/:date', component: IntencjeWybraneComponent },
  { path: 'ogloszenia', component: OgloszeniaComponent },
  { path: 'ogloszenia/:date', component: OgloszeniaWybraneComponent },
  { path: 'galeria', component: GaleriaComponent },
  { path: 'galeria/:name', component: FolderComponent },
  { path: 'nabozenstwa', component: NabozenstwaComponent },
  { path: '**', redirectTo: '' },
];
